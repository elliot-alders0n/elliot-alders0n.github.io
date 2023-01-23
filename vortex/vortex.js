function setup() {
  
    CANVAS_SIZE = 400;
    CANVAS_MARGIN = 0.05;
    
    createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    
    N = 49;
    M = 2;
    
    // Slider para el tamaño
    group = createDiv('');
    group.position(150, CANVAS_SIZE+10);
    main_radius_slider = createSlider(100,(CANVAS_SIZE/2)-(CANVAS_MARGIN*CANVAS_SIZE),100,1);
    main_radius_slider.parent(group);
    main_radius_slider.position(-150,0);
    labelSize = createSpan('Tamaño = '+100);
    labelSize.parent(group);
  
    labelSize.style('color','white');
    labelSize.style('font-weight','bold');
  
    
    
    // Slider para el multiplicador
    group = createDiv('');
    group.position(150, CANVAS_SIZE+50);  
    multiplier_slider = createSlider(2,100,M,1);
    multiplier_slider.parent(group);
    multiplier_slider.position(-150,0);
    labelMultiplier = createSpan('Multiplicador = '+2);
    labelMultiplier.parent(group);
    multiplier_slider.changed(modulusSliderChanged);
  
    labelMultiplier.style('color','white');
    labelMultiplier.style('font-weight','bold');
    
    // Slider para el módulo
    group = createDiv('');
    group.position(150, CANVAS_SIZE+90);  
    modulus_slider = createSlider(9,91,N,1);
    modulus_slider.position(0,CANVAS_SIZE+50);
    modulus_slider.parent(group);
    modulus_slider.position(-150,0);
    labelModulus = createSpan('Módulo = '+2);
    labelModulus.parent(group);
  
    modulus_slider.style('color','white');
    modulus_slider.style('font-weight','bold');
    
    
    modulus_slider.changed(modulusSliderChanged);
    
    
    
    //------
    current_number = 1;
    r = main_radius_slider.value();
    modulus = modulus_slider.value();
    mult = multiplier_slider.value();
    
    generateCoordinates(N);
    
    
    this.particles = [];
    
    ar = generateArray(N+1);
  
    
    all_loops = getLoops(ar,mult,N);
  
  
    
    updateNeeded = false;
  }
  
  
  function generateArray(n){
    res = [];
    for(let i=0;i<n-1;i++){
      res.push(i);
    }
    return res;
  }
  
  function draw() {
    
    colorMode(HSB);
      
    background(0);
    r = main_radius_slider.value();
    //r = main_radius_slider.value();
    //modulus = modulus_slider.value();
    //mult = multiplier_slider.value();
  
    labelMultiplier.html("Multiplicador = "+mult);
    labelModulus.html("Módulo = " + modulus);
    translate(width/2,height/2);
    //drawMainCircle(r);
    generateCoordinates(modulus);
    drawPoints(r,modulus);
    drawAllLines();
  
    //drawCurrentNumber();
  
  
    for(let i=0;i<this.particles.length;i++){
      current_particle = this.particles[i];
  
  
      current_particle.draw();
      current_loop = all_loops[i];
  
      target = coordinates[current_loop.getCurrentValue()];
  
  
      sourceCoord = coordinates[current_loop.prevItem()];
  
      current_particle.x = lerp(current_particle.x,target.x,0.08);
      current_particle.y = lerp(current_particle.y,target.y,0.08);
  
      if(abs(current_particle.x-target.x)<0.1 && abs(current_particle.y-target.y)<0.1){
        current_loop.nextItem();
      }
    }
    
    if(updateNeeded){
      updateNeeded = false;
      
      modulus = modulus_slider.value();
      mult = multiplier_slider.value();
  
      generateCoordinates(modulus);
  
  
      this.particles = [];
  
      ar = generateArray(modulus+1);
  
  
      all_loops = getLoops(ar,mult,modulus);
      
    }
  }
  
  function nextElement(index){
    
    return res;
  }
  
  function drawAllLines(){
    
    for(let i=0;i<all_loops.length;i++){
      loop_i = all_loops[i].arr;
      
      for(let j=0;j<loop_i.length-1;j++){
        point_src = coordinates[loop_i[j]];
        point_dst = coordinates[loop_i[j+1]];
        
        stroke(0, 2, 72);
        
        stroke(30*particles[i].id,255,60);
        line(point_src.x,point_src.y,point_dst.x,point_dst.y);
      }
      
      line(point_dst.x,point_dst.y,coordinates[loop_i[0]].x,coordinates[loop_i[0]].y);
    }
  }
  
  function generateCoordinates(n){
    coordinates = [];
    for(let i=0;i<n;i++){
      alfa = (TWO_PI*i/n)-(PI/2);
      coor = createVector(r*cos(alfa),r*sin(alfa));
      coordinates.push(coor);
    }
  }
  
  function drawPoints(radius){
    //noStroke();
    //fill(240,100,100);
    stroke(0, 0, 100);
    noFill();
    for(let i=0;i<coordinates.length;i++){
      v = coordinates[i];
      ellipse(v.x,v.y,5);
    }
  }
  
  
  function drawMainCircle(radius){
    stroke(255);
    noFill();
    strokeWeight(2);
    ellipse(0,0,radius*2);
  }
  
  function drawCurrentNumber(){
    textAlign(CENTER, CENTER);
    fill(255);
    noStroke();
    textSize(50);
    text(current_number,0,0);
  }
  
  function nextStep(num, mult, mod){
    return (mult*num)%mod;
  }
  
  function modulusSliderChanged(){
    current_number = 1;
    updateNeeded = true;
  }
  
  
  function getLoops(arr,multiplier,mod){
    
    loops = [];
    
    current_index = 1;
    
    n = arr[current_index];
    
    let j = 1;
    while(arr.length > 0){
      values = [];
      stop = false;
      n = arr[1];
      while(!stop){
        n = nextStep(n,multiplier,mod);
        
        arr.splice(arr.indexOf(n),1);
  
        if(values.includes(n)){
          a = values.slice(values.indexOf(n),values.length);
          
          if(a.length>0){
            // Create new loop
            l = new Loop(a);
            if(l.arr.length>1){
              loops.push(l);


              coord = coordinates[l.arr[0]];

              // Create new particle
              p = new Particle(j,coord.x,coord.y);
              j++;

              this.particles.push(p);
            }
          }
          stop = true;
        }else{
          values.push(n);
        }
      }
      
    }
    
    return loops;
  }
  
  
  function isAlreadyLoop(number,loop_obj){
    for(let i=0;i<loop_obj.length;i++){
      if(loop_obj[i].arr.includes(number)){
        return true;
      }
    }
    return false;
  }
  
  class Particle{
    
    constructor(id,x,y){
      this.id = id;
      this.x = x;
      this.y = y;
    }
    
    draw(){
      noStroke();
      fill(30*this.id,255,255);
      ellipse(this.x, this.y,5,5);
    }
    
  }
  
  class Loop{
    constructor(loop_arr){
      this.arr = loop_arr;
      this.ptr = 0;
    }
    
    addItem(item){
      this.arr.push(item);
    }
    
    nextItem(){
      this.ptr = (this.ptr+1)%(this.arr.length);
      return this.arr[this.ptr];
    }
    
    prevItem(){
      return this.arr[(this.ptr-1+this.arr.length)%(this.arr.length)];
    }
    
    
    getCurrentValue(){
      return this.arr[this.ptr];
    }
    
  }
  
