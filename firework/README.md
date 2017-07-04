###canvas story
###用canvas讲一个故事
在codepen上看到了一个烟花燃放的特效，觉得很有故事性，除了canvas
的3d外，觉得拿canvas讲一个故事也是不错的。

 [源码地址](http://codepen.io/K-T/pen/NjyNQy)
 
###效果图

<div style="margin-bottom: 20px;"><p data-height="400" data-theme-id="0" data-slug-hash="wemXqp" data-default-tab="result" data-user="shadowwalkerzero" data-embed-version="2" data-pen-title="fireworks seen in the countryside" class="codepen">See the Pen <a href="https://codepen.io/shadowwalkerzero/pen/wemXqp/">fireworks seen in the countryside</a> by shadowwalkerzero (<a href="https://codepen.io/shadowwalkerzero">@shadowwalkerzero</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script></div>

###源码结构
入口: RENDERER.init

步骤:
 
1. this.setParameters();         //设置canvas  叶子掉落间隔

2. this.reconstructMethod();	      //在render中绑定this
 
3. this.createTwigs();            //绘叶子

4. this.createStars();				//绘星星

5. this.render();					//绘画


### createTwigs 绘叶子

源码实例:

 		this.twigs.push(new TWIG(this.width, this.height, 0, 0, Math.PI * 3 / 4, 0));
        this.twigs.push(new TWIG(this.width, this.height, this.width, 0, -Math.PI * 3 / 4, Math.PI));
        this.twigs.push(new TWIG(this.width, this.height, 0, this.height, Math.PI / 4, Math.PI));
        this.twigs.push(new TWIG(this.width, this.height, this.width, this.height, -Math.PI / 4, 0));


#### 关于Twig的实现
	var TWIG = function(width, height, x, y, angle, theta){
	    this.width = width;
	    this.height = height;
	    this.x = x;
	    this.y = y;
	    this.angle = angle;
	    this.theta = theta;
	    this.rate = Math.min(width, height) / 500;
	};
	
TWIG 的构造函数 

width: canvas 的width

height: canvas 的height

x: 绘画的 x 起点

y: 绘画的 y 起点

angle: canvas的旋转的角度

theta: 细枝的初始值
	
	TWIG.prototype = {
    SHAKE_FREQUENCY: Math.PI / 300,
    MAX_LEVEL: 4,
    COLOR: 'hsl(120, 60%, 1%)',

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
    }
    
    
SHAKE_FREQUENCY: 叶子摆动的角度

MAX_LEVEL: 叶子的瓣数(1瓣分为左右)

COLOR: 叶子的颜色

***
介绍一下 renderblock:

<img src="./img/twig.png"/>

 1. context.moveTo(0, -length);    画出线条 1
 2. if === this.MAX_LEVEL 画出 4 
 	 else 画出 2,3 
 3. else 中
    
    3.1.context.translate(0, -40); 将坐标移至画线1的的末端
    
    3.2.context.rotate((Math.PI / 3 - Math.PI / 20 * level) * i); 画杆子两边的叶子 趋势是按照  Math.PI / 20 开角减小
    
    3.3 context.scale(1 - level / 10, 1 - level / 10); 设置缩放 趋势是叶子越来越小
    
    3.4 绘制2， 3 	
    	
    	context.beginPath();		
		context.moveTo(0, 0);
		context.lineTo(0, -length * 0.8);  //绘制线2
		context.quadraticCurveTo(30, -length * 0.8 - 20, 0, -length * 0.8 - 80);   //绘制叶子3
		context.quadraticCurveTo(-30, -length * 0.8 - 20, 0, -length * 0.8);
		//绘制关于中间杆子对称的叶子
		context.stroke();
4. 对于if 中 绘画叶子4 与3 差不多，这里就不赘述了。 


###关于飘落的叶子
在看懂第一部分枝干的画法后，关于叶子的实现就简单的多了
直接看源码的render实现吧

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
    	 	  
leaf 的render 在 rendered中由rfa调用，画叶子还是使用贝塞尔曲线画出两瓣，作者设置了vx 和 vy 作为增量，同时每次让叶子在空中旋转。
看一看作者在init中对于vx和vy的定义

	this.x = this.renderer.getRandomValue({min : 0, max : this.width});
	this.vx = this.renderer.getRandomValue({min : 0, max : 1}) * (this.x <= this.width / 2 ? 1 : -1);
	this.vy = this.VELOCITY_Y;
	
一旦随机生成的x坐标大于2/width 叶子就像右刮。反之，向左。这个还是很简单的。


###关于star的部分
star作者本身的思路就是画圆－－
 
看看render的实现
	
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
1，作者的思路就是 通过设置一个cosa 做出星星忽明忽暗的效果
2. rotate 做出星星略微的移动

###firework的实现
烟花分为两部分，一部分为烟花上升，一部分为烟花炸开的时候。 这里我们先看烟花上升的实现，大致像一束光束。

来看看render的实现，这个有点意思。
	
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
	
case 0: 是new 出来的默认状态，作者用scale 缩放实现出细长的光束，作者的思路是烟火上升的一个阈值的时候 减小透明度。

	context.globalAlpha = (this.y0 - this.y) <= this.THRESHOLD ? ((this.y0 - this.y) / this.THRESHOLD) : 1;	
	
this.y0是 this.height + this.RADIUS; 应该是整个烟花运动的最大轨迹，this.y 会 以velocity的速率减小(具体的初始值请看构造函数) 即当烟花从y0运动到[this.y, this.y + threshold]时，就减小透明度。

y0的定义以及shrehold的定义请看FIREWORK.prototype.setParameters 的定义。


当烟火离开canvas时，就进入准备爆炸的阶段了，这时对应于case1. 这里作者做了一个延时，即在waitCount之后，烟花爆炸。这个时候 进入state3. state3负责生成爆炸颗粒，同时减小透明度，一旦透明度降为0，就意味着要生成新的烟花了。



最后的最后 到了爆炸的颗粒了
###particle的实现
如何让烟花炸开呢？其实只要让粒子沿着粒子某一个方向运动就好了
看看 render 的实现吧

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
	
因为这里的render的比较短，我就把init也加了进来，辅助阅读。 vx和vy 是速度的增量。这里作者为了逼真给vy加了一个重力加速度，同时加入了摩擦力。render 还是很简单的。

**可能有人想问我是怎么做到烟花爆炸后canvas变亮呢？**

在renderer的render中有

	contextFireworks.fillStyle = this.SKY_COLOR.replace('%luminance', 5 + maxOpacity * 15);

对应的firework的 getOpacity 方法

	getOpacity : function(){
		return this.status == 2 ? this.opacity : 0;
	}
	
这里我们就知道了，当烟花准备爆炸的时候，canvas 突然变亮，不然其余的 getOpacity 均为 0	