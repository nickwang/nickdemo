var g_timeOut=null;
if (window.DeviceMotionEvent) {

  window.addEventListener('devicemotion', deviceMotionHandler, false);

} else {

  document.getElementById("id_info").innerHTML = "Not supported on your device."

}

function deviceMotionHandler(eventData) {
  // 捕捉重力加速度
  var acceleration = eventData.accelerationIncludingGravity;
 
  // 打印加速数据
  var rawAcceleration = "[" +  Math.round(acceleration.x) + ", " + 
    Math.round(acceleration.y) + ", " + Math.round(acceleration.z) + "]";
 
  // Z轴,可知设备朝上或者朝下
  var facingUp = -1;
  if (acceleration.z > 0) {
    facingUp = +1;
  }
 
  // 根据重力通过 acceleration.x|y 转换得到加速值,
  // 运用重力加速度9.81来计算得到一个百分比然后乘以转换角度90
  var tiltLR = Math.round(((acceleration.x) / 9.81) * -90);
  var tiltFB = Math.round(((acceleration.y + 9.81) / 9.81) * 90 * facingUp);
  
  var str='';
  str=['moAccel:',rawAcceleration,
  'moCalcTiltLR:',tiltLR,
  'moCalcTiltFB:',tiltFB,
  'facingUp:',facingUp
  ].join('<br>');
  /*
  // 打印加速度的计算结果
  document.getElementById("moAccel").innerHTML = rawAcceleration;
  document.getElementById("moCalcTiltLR").innerHTML = tiltLR;
  document.getElementById("moCalcTiltFB").innerHTML = tiltFB;
 
  // 将2D和3D的转换应用到图片上
  var rotation = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB) + "deg)";
  document.getElementById("imgLogo").style.webkitTransform = rotation;
    */
    document.getElementById('id_info').innerHTML=str;  
 

   drawWater({
    	rawAcceleration:rawAcceleration,
    	moCalcTiltLR:tiltLR,
     	moCalcTiltFB:tiltFB,
    	facingUp:facingUp
    }); 

 
 
      
};

function Point(x,y){
	this.x=x;
	this.y=y;
};
var _canvas=document.getElementById('idwater');
var ctx=_canvas.getContext("2d");
//var waterWidth=document.body.clientWidth;
//var waterHeight=document.body.clientHeight;
var waterWidth=400;
var waterHeight=400;
_canvas.setAttribute('width',waterWidth);
_canvas.setAttribute('height',waterHeight);

var leftTopPoint=new Point(0,waterHeight/2);
var righTopPoint=new Point(waterWidth,waterHeight/2);

var middleHeight=waterHeight/2;
var middleWidth=waterWidth/2;
var middlePoint=new Point(middleWidth,middleHeight);

var leftBottomPoint=new Point(0,waterHeight);
var rightBottomPoint=new Point(waterWidth,waterHeight);

var lastTiltLR=0;


function drawWater(obj){
	
	var rawAcceleration=obj.rawAcceleration;
	var moCalcTiltLR=obj.moCalcTiltLR;
	var moCalcTiltFB=obj.moCalcTiltFB;
	var facingUp=obj.facingUp;
	
	if( Math.abs(Math.abs(moCalcTiltLR)-Math.abs(lastTiltLR))<2){
		return ;
	};
	//var moCalcTiltLR=50;
	
	var lr=Math.abs(moCalcTiltLR)*0.017453293;	//转换成弧度

	var mbs=Math.tan(lr)*middleWidth;
	/*
	if(moCalcTiltLR>0){

		leftTopPoint.y=waterHeight/2-mbs;
		righTopPoint.y=waterHeight/2+mbs;

	}else{

		leftTopPoint.y=waterHeight/2+mbs;
		righTopPoint.y=waterHeight/2-mbs;

	};*/
	lastTiltLR=moCalcTiltLR;
	//document.getElementById('id_info').innerHTML+=['leftTopPoint.y=',leftTopPoint.y,'righTopPoint.y',righTopPoint.y].join('<br>');
	ctx.clearRect(0,0,waterWidth,waterHeight)
	//ctx.save();    //开始画下一页的背景
	  
	ctx.beginPath();
	/*
	ctx.moveTo(leftTopPoint.x,leftTopPoint.y);
	ctx.lineTo(leftBottomPoint.x,leftBottomPoint.y);
	ctx.lineTo(rightBottomPoint.x,rightBottomPoint.y);
	ctx.lineTo(righTopPoint.x,righTopPoint.y);
	*/

	
	
	//ctx.moveTo(righTopPoint.x,righTopPoint.y);
	//ctx.lineTo(rightBottomPoint.x,rightBottomPoint.y);
	
	ctx.moveTo(rightBottomPoint.x,rightBottomPoint.y);

	ctx.lineTo(leftBottomPoint.x,leftBottomPoint.y);
	
	
	var maxI=Math.abs(waterWidth*2/Math.cos(lr));

	//var w=2*Math.PI/(waterWidth/2);
	var w=2*Math.PI/(maxI/3);
	ctx.save();

	
	//确定旋转的方向
	if(moCalcTiltLR>0){
		ctx.translate(0,0-mbs);
	
		ctx.lineTo(leftTopPoint.x,leftTopPoint.y);
		ctx.rotate(lr);

	}else{

		ctx.translate(0,mbs);
		ctx.lineTo(leftTopPoint.x,leftTopPoint.y);
		ctx.rotate(2*Math.PI-lr);

	}
	
	
	//var maxI=waterWidth;
	//maxI=waterWidth/2;
	var initValue=100;

	for(var i=-500;i<maxI;i+=0.1){
 		//ctx.lineTo(i,30*Math.sin(w*i)+middleHeight);
 		var x=i;
 		var y=30*Math.sin(w*i+initValue)+middleHeight;

 		ctx.lineTo(x,y);

	}

	ctx.restore();
	//ctx.lineTo(righTopPoint.x,righTopPoint.y);

	//ctx.lineTo(leftTopPoint.x,leftTopPoint.y);
	//ctx.quadraticCurveTo(righTopPoint.x,righTopPoint.y,leftTopPoint.x,leftTopPoint.y);
	/*var linear = ctx.createLinearGradient(leftTopPoint.x,leftTopPoint.y,leftBottomPoint.x,leftBottomPoint.y);
			linear.addColorStop(0,"#fff");
			linear.addColorStop(0.5,"#f0f");
			linear.addColorStop(1,"#333");
	ctx.fillStyle=linear;*/
	ctx.fillStyle ='#b1e5f2';

	
    ctx.fill();
	ctx.closePath();

};
