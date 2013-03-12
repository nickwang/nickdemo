/*
 *
 * Find more about this plugin by visiting
 * http://alxgbsn.co.uk/
 *
 * Copyright (c) 2010-2012 Alex Gibson
 * Released under MIT license
 *
 */

(function (window, document) {

  function Shake() {

		//feature detect
		this.hasDeviceMotion = 'ondevicemotion' in window;

		//default velocity threshold for shake to register
		this.threshold = 9;

		//use date to prevent multiple shakes firing	
		this.lastTime = new Date();

		//accelerometer values
		this.lastX = null;
		this.lastY = null;
		this.lastZ = null;

		//create custom event
		this.event = document.createEvent('Event');
		this.event.initEvent('shake', true, true);
		this.maxX=0;
		this.maxY=0;
		this.maxZ=0;
		this.maxDeltaX=0;
		this.maxDeltaY=0;
		this.maxDeltaZ=0;
	}

	//reset timer values
	Shake.prototype.reset = function () {

		this.lastTime = new Date();
		this.lastX = null;
		this.lastY = null;
		this.lastZ = null;
		this.maxX=0;
		this.maxY=0;
		this.maxZ=0;
	};

	//start listening for devicemotion
	Shake.prototype.start = function () {

		this.reset();
		if (this.hasDeviceMotion) { window.addEventListener('devicemotion', this, false); }
	};

	//stop listening for devicemotion
	Shake.prototype.stop = function () {

		if (this.hasDeviceMotion) { window.removeEventListener('devicemotion', this, false); }
		this.reset();
	};

	//calculates if shake did occur
	Shake.prototype.devicemotion = function (e) {

		var current = e.accelerationIncludingGravity,
			currentTime,
			timeDifference,
			deltaX = 0,
			deltaY = 0,
			deltaZ = 0;

		if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {

			this.lastX = current.x;
			this.lastY = current.y;
			this.lastZ = current.z;
			return;
		}

		deltaX = Math.abs(this.lastX - current.x);
		deltaY = Math.abs(this.lastY - current.y);
		deltaZ = Math.abs(this.lastZ - current.z);
		/*
		var str=['x=',current.x,
			'y=',current.y,
			'z=',current.z,
			'deltaX=',deltaX,
			'deltaY=',deltaY,
			'deltaZ=',deltaZ].join('\n');
               	
		this.maxX=current.x>this.maxX ? current.x :this.maxX;
		this.maxY=current.y>this.maxY ? current.y : this.maxY;
		this.maxZ=current.z>this.maxZ ? current.z : this.maxZ;
		document.getElementById('idRaw').innerHTML='<h1>'+str+'</h1>';*/
		this.maxDeltaX=deltaX>this.maxDeltaX ? deltaX : this.maxDeltaX;
		this.maxDeltaY=deltaY>this.maxDeltaY ? deltaY : this.maxDeltaY;
		
		this.maxDeltaZ=deltaZ>this.maxDeltaZ ? deltaZ : this.maxDeltaZ;
		
		var str=['maxDeltaX=',this.maxDeltaX,
			'maxDeltaY=',this.maxDeltaY,
			'maxDeltaZ=',this.maxDeltaZ].join('\n');
			
		document.getElementById('idRaw').innerHTML='<h1>'+str+'</h1>';
		
		if (((deltaX > this.threshold) && (deltaY > this.threshold)) || ((deltaX > this.threshold) && (deltaZ > this.threshold)) || ((deltaY > this.threshold) && (deltaZ > this.threshold))) {

			//calculate time in milliseconds since last shake registered
			currentTime = new Date();
			timeDifference = currentTime.getTime() - this.lastTime.getTime();

			if (timeDifference > 1000) {
				window.dispatchEvent(this.event);
				str=['x=',current.x,
					'y=',current.y,
					'z=',current.z,
					'deltaX=',deltaX,
					'deltaY=',deltaY,
					'deltaZ=',deltaZ,
					'maxDeltaX=',this.maxDeltaX,
					'maxDeltaY=',this.maxDeltaY,
					'maxDeltaZ=',this.maxDeltaZ].join('\n');
				document.getElementById('idResult').innerHTML='<div><h1>shake info:</h1></div><h1>'+str+'</h1>';
				this.maxX=0;
				this.maxY=0;
				this.maxZ=0;
				this.maxDeltaX=0;
				this.maxDeltaY=0;
				this.maxDeltaZ=0;
				
				this.lastTime = new Date();
			}
		}
	};

	//event handler
	Shake.prototype.handleEvent = function (e) {

		if (typeof (this[e.type]) === 'function') {
			return this[e.type](e);
		}
	};

	//create a new instance of shake.js.
	var myShakeEvent = new Shake();
	myShakeEvent.start();

}(window, document));

window.onload = function() {
document.getElementById('idTip').innerHTML='onloaded';
var shakeCount=0;
  window.addEventListener('shake', shakeEventDidOccur, false);

	//define a custom method to fire when shake occurs.
	function shakeEventDidOccur () {
	shakeCount++;
	document.getElementById('idTip').innerHTML='<h1> shake count ='+shakeCount+'</h1>';
	 document.getElementById('id_info').innerHTML='<h1>is shaked at'+new Date().toLocaleString()+'</h1>'; 

		
	}
};

