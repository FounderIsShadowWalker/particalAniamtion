var RENDERER = {
	LEAF_INTERVAL_RANGE : {min : 100, max : 200},
	FIREWORK_INTERVAL_RANGE : {min : 20, max : 200},
	SKY_COLOR : 'hsla(210, 60%, %luminance%, 0.2)',
	STAR_COUNT : 100,
	
	init : function(){
		this.setParameters();
		this.reconstructMethod();
		this.createTwigs();
		this.createStars();
		this.render();
	},
	setParameters : function(){
		this.$container = $('#jsi-fireworks-container');
		this.width = this.$container.width();
		this.height = this.$container.height();
		this.distance = Math.sqrt(Math.pow(this.width / 2, 2) + Math.pow(this.height / 2, 2));
		this.contextFireworks = $('<canvas />').attr({width : this.width, height : this.height}).appendTo(this.$container).get(0).getContext('2d');
		this.contextTwigs = $('<canvas />').attr({width : this.width, height : this.height}).appendTo(this.$container).get(0).getContext('2d');
		
		this.twigs = [];
		this.leaves = [new LEAF(this.width, this.height, this)];
		this.stars = [];
		this.fireworks = [new FIREWORK(this.width, this.height, this)];
		
		this.leafInterval = this.getRandomValue(this.LEAF_INTERVAL_RANGE) | 0;
		this.maxFireworkInterval = this.getRandomValue(this.FIREWORK_INTERVAL_RANGE) | 0;
		this.fireworkInterval = this.maxFireworkInterval;
	},
	reconstructMethod : function(){
		this.render = this.render.bind(this);
	},
	getRandomValue : function(range){
		return range.min + (range.max - range.min) * Math.random();
	},
	createTwigs : function(){
		this.twigs.push(new TWIG(this.width, this.height, 0, 0, Math.PI * 3 / 4, 0));
		this.twigs.push(new TWIG(this.width, this.height, this.width, 0, -Math.PI * 3 / 4, Math.PI));
		this.twigs.push(new TWIG(this.width, this.height, 0, this.height, Math.PI / 4, Math.PI));
		this.twigs.push(new TWIG(this.width, this.height, this.width, this.height, -Math.PI / 4, 0));
	},
	createStars : function(){
		for(var i = 0, length = this.STAR_COUNT; i < length; i++){
			this.stars.push(new STAR(this.width, this.height, this.contextTwigs, this));
		}
	},
	render : function(){
		requestAnimationFrame(this.render);
		
		var maxOpacity = 0,
			contextTwigs = this.contextTwigs,
			contextFireworks = this.contextFireworks;
		
		for(var i = this.fireworks.length - 1; i >= 0; i--){
			maxOpacity = Math.max(maxOpacity, this.fireworks[i].getOpacity());
		}
		contextTwigs.clearRect(0, 0, this.width, this.height);
		contextFireworks.fillStyle = this.SKY_COLOR.replace('%luminance', 5 + maxOpacity * 15);
		contextFireworks.fillRect(0, 0, this.width, this.height);
		
		for(var i = this.fireworks.length - 1; i >= 0; i--){
			if(!this.fireworks[i].render(contextFireworks)){
				this.fireworks.splice(i, 1);
			}
		}
		for(var i = this.stars.length - 1; i >= 0; i--){
			this.stars[i].render(contextTwigs);
		}
		for(var i = this.twigs.length - 1; i >= 0; i--){
			this.twigs[i].render(contextTwigs);
		}
		for(var i = this.leaves.length - 1; i >= 0; i--){
			if(!this.leaves[i].render(contextTwigs)){
				this.leaves.splice(i, 1);
			}
		}
		if(--this.leafInterval == 0){
			this.leaves.push(new LEAF(this.width, this.height, this));
			this.leafInterval = this.getRandomValue(this.LEAF_INTERVAL_RANGE) | 0;
		}
		if(--this.fireworkInterval == 0){
			this.fireworks.push(new FIREWORK(this.width, this.height, this));
			this.maxFireworkInterval = this.getRandomValue(this.FIREWORK_INTERVAL_RANGE) | 0;
			this.fireworkInterval = this.maxFireworkInterval;
		}
	}
};
var TWIG = function(width, height, x, y, angle, theta){
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.angle = angle;
	this.theta = theta;
	this.rate = Math.min(width, height) / 500;
};
TWIG.prototype = {
	SHAKE_FREQUENCY : Math.PI / 300,
	MAX_LEVEL : 4,
	COLOR : 'hsl(120, 60%, 1%)',
	
	renderBlock : function(context, x, y, length, level, angle){
		context.save();
		context.translate(x, y);
		context.rotate(this.angle + angle * (level + 1));
		context.scale(this.rate, this.rate);
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(0, -length);
		context.stroke();
		context.fill();
		
		if(level == this.MAX_LEVEL){
			length = length / (1 - level / 10);
			
			context.save();
			context.beginPath();
			context.scale(1 - level / 10, 1 - level / 10);
			context.moveTo(0, -length);
			context.quadraticCurveTo(30, -length - 20, 0, -length - 80);
			context.quadraticCurveTo(-30, -length - 20, 0, -length);
			context.stroke();
			context.fill();
			context.restore();
			context.restore();
		}else{
			for(var i = -1; i <= 1; i += 2){
				context.save();
				context.translate(0, -40);
				context.rotate((Math.PI / 3 - Math.PI / 20 * level) * i);
				context.scale(1 - level / 10, 1 - level / 10);
				context.beginPath();
				context.moveTo(0, 0);
				context.lineTo(0, -length * 0.8);
				context.quadraticCurveTo(30, -length * 0.8 - 20, 0, -length * 0.8 - 80);
				context.quadraticCurveTo(-30, -length * 0.8 - 20, 0, -length * 0.8);
				context.stroke();
				context.fill();
				context.restore();
			}
			context.restore();
			level++;
			this.renderBlock(context, x + 40 * Math.sin(this.angle + angle * level), y - 40 * Math.cos(this.angle + angle * level) , length, level, angle);
		}
	},
	render : function(context){
		context.fillStyle = this.COLOR;
		context.strokeStyle = this.COLOR;
		context.lineWidth = 3;
		this.renderBlock(context, this.x, this.y, 40, 0,  Math.PI / 48 * Math.sin(this.theta));
		this.theta += this.SHAKE_FREQUENCY;
		this.theta %= Math.PI * 2;
	}
};
var LEAF = function(width, height, renderer){
	this.width = width;
	this.height = height;
	this.renderer = renderer;
	this.init();
};
LEAF.prototype = {
	OFFSET : 100,
	VELOCITY_Y : 3,
	COLOR : 'hsl(120, 60%, 1%)',
	
	init : function(){
		this.x = this.renderer.getRandomValue({min : 0, max : this.width});
		this.y = -this.OFFSET;
		this.vx = this.renderer.getRandomValue({min : 0, max : 1}) * (this.x <= this.width / 2 ? 1 : -1);
		this.vy = this.VELOCITY_Y;
		
		this.rate = this.renderer.getRandomValue({min : 0.4, max : 0.8});
		this.theta = this.renderer.getRandomValue({min : 0, max : Math.PI * 2});
		this.deltaTheta = this.renderer.getRandomValue({min : -Math.PI / 300, max : Math.PI / 300});
	},
	render : function(context){
		context.save();
		context.filleStyle = this.COLOR;
		context.translate(this.x, this.y);
		context.rotate(this.theta);
		context.scale(this.rate, this.rate);
		context.beginPath();
		context.moveTo(0, 0);
		context.quadraticCurveTo(30, -20, 0, -80);
		context.quadraticCurveTo(-30, -20, 0, 0);
		context.fill();
		context.restore();
		
		this.x += this.vx * this.rate;
		this.y += this.vy * this.rate;
		this.theta += this.deltaTheta;
		this.theta %= Math.PI * 2;
		
		return this.y <= this.height + this.OFFSET && this.x >= -this.OFFSET && this.x <= this.width + this.OFFSET;
	}
};
var STAR = function(width, height, context, renderer){
	this.width = width;
	this.height = height;
	this.renderer = renderer;
	this.init(context);
};
STAR.prototype = {
	RADIUS_RANGE : {min : 1, max : 4},
	COUNT_RANGE : {min : 100, max : 1000},
	DELTA_THETA : Math.PI / 30,
	DELTA_PHI : Math.PI / 50000,
	
	init : function(context){
		this.x = this.renderer.getRandomValue({min : 0, max : this.width});
		this.y = this.renderer.getRandomValue({min : 0, max : this.height});
		this.radius = this.renderer.getRandomValue(this.RADIUS_RANGE);
		this.maxCount = this.renderer.getRandomValue(this.COUNT_RANGE) | 0;
		this.count = this.maxCount;
		this.theta = 0;
		this.phi = 0;
		
		this.gradient = context.createRadialGradient(0, 0, 0, 0, 0, this.radius);
		this.gradient.addColorStop(0, 'hsla(220, 80%, 100%, 1)');
		this.gradient.addColorStop(0.1, 'hsla(220, 80%, 80%, 1)');
		this.gradient.addColorStop(0.25, 'hsla(220, 80%, 50%, 1)');
		this.gradient.addColorStop(1, 'hsla(220, 80%, 30%, 0)');
	},
	render : function(context){
		context.save();
		context.globalAlpha = Math.abs(Math.cos(this.theta));
		context.translate(this.width / 2, this.height / 2);
		context.rotate(this.phi);
		context.translate(this.x - this.width / 2, this.y - this.height / 2);
		context.beginPath();
		context.fillStyle = this.gradient;
		context.arc(0, 0, this.radius, 0, Math.PI * 2, false);
		context.fill();
		context.restore();
		
		if(--this.count == 0){
			this.theta = Math.PI;
			this.count = this.maxCount;
		}
		if(this.theta > 0){
			this.theta -= this.DELTA_THETA;
		}
		this.phi += this.DELTA_PHI;
		this.phi %= Math.PI / 2;
	}
};
var FIREWORK = function(width, height, renderer){
	this.width = width;
	this.height = height;
	this.renderer = renderer;
	this.init();
};
FIREWORK.prototype = {
	COLOR : 'hsl(%hue, 80%, 60%)',
	PARTICLE_COUNT : 300,
	DELTA_OPACITY : 0.01,
	RADIUS : 2,
	VELOCITY : -3,
	WAIT_COUNT_RANGE : {min : 30, max : 60},
	THRESHOLD : 50,
	DELTA_THETA : Math.PI / 10,
	GRAVITY : 0.002,
	
	init : function(){
		this.setParameters();
		this.createParticles();
	},
	setParameters : function(){
		var hue = 256 * Math.random() | 0;
			
		this.x = this.renderer.getRandomValue({min : this.width / 8, max : this.width * 7 / 8});
		this.y = this.renderer.getRandomValue({min : this.height / 4, max : this.height / 2});
		this.x0 = this.x;
		this.y0 = this.height + this.RADIUS;
		this.color = this.COLOR.replace('%hue', hue);
		this.status = 0;
		this.theta = 0;
		this.waitCount = this.renderer.getRandomValue(this.WAIT_COUNT_RANGE);
		this.opacity = 1;
		this.velocity = this.VELOCITY;
		this.particles = [];
	},
	createParticles : function(){
		for(var i = 0, length = this.PARTICLE_COUNT; i < length; i++){
			this.particles.push(new PARTICLE(this.x, this.y, this.renderer));
		}
	},
	getOpacity : function(){
		return this.status == 2 ? this.opacity : 0;
	},
	render : function(context){
		switch(this.status){
		case 0:
			context.save();
			context.fillStyle = this.color;
			context.globalCompositeOperation = 'lighter';
			context.globalAlpha = (this.y0 - this.y) <= this.THRESHOLD ? ((this.y0 - this.y) / this.THRESHOLD) : 1;
			context.translate(this.x0 + Math.sin(this.theta) / 2, this.y0);
			context.scale(0.8, 2.4);
			context.beginPath();
			context.arc(0, 0, this.RADIUS, 0, Math.PI * 2, false);
			context.fill();
			context.restore();
			
			this.y0 += this.velocity;
			
			if(this.y0 <= this.y){
				this.status = 1;
			}
			this.theta += this.DELTA_THETA;
			this.theta %= Math.PI * 2;
			this.velocity += this.GRAVITY;
			return true;
		case 1:
			if(--this.waitCount <= 0){
				this.status = 2;
			}
			return true;
		case 2:
			context.save();
			context.globalCompositeOperation = 'lighter';
			context.globalAlpha = this.opacity;
			context.fillStyle = this.color;
			
			for(var i = 0, length = this.particles.length; i < length; i++){
				this.particles[i].render(context, this.opacity);
			}
			context.restore();
			this.opacity -= this.DELTA_OPACITY;
			return this.opacity > 0;
		}
	}
};
var PARTICLE = function(x, y, renderer){
	this.x = x;
	this.y = y;
	this.renderer = renderer;
	this.init();
};
PARTICLE.prototype = {
	RADIUS : 1.5,
	VELOCITY_RANGE : {min : 0, max : 3},
	GRAVITY : 0.02,
	FRICTION : 0.98,
	
	init : function(){
		var radian = Math.PI * 2 * Math.random(),
			velocity = (1 - Math.pow(Math.random(), 6)) * this.VELOCITY_RANGE.max,
			rate = Math.random();
			
		this.vx = velocity * Math.cos(radian) * rate;
		this.vy = velocity * Math.sin(radian) * rate;
	},
	render : function(context, opacity){
		context.beginPath();
		context.arc(this.x, this.y, this.RADIUS, 0, Math.PI * 2, false);
		context.fill();
		
		this.x += this.vx;
		this.y += this.vy;
		this.vy += this.GRAVITY;
		this.vx *= this.FRICTION;
		this.vy *= this.FRICTION;
	}
};
$(function(){
	RENDERER.init();
});