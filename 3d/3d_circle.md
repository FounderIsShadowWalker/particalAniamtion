#如何用canvas做一个3d球
先前在博客园看过Waxes同学在博客园做的3d球的demo，地址在这

> [W·Axes的博客园](http://www.cnblogs.com/axes/p/4960171.html)


把他的demo pull了下面，很多数学公式，即便在他的博客园里也有两个公式无法解释。因此，这里就写一篇自己思路的文章，教大家如何用canvas画一个3d球。

效果如下

> [请点这里](http://codepen.io/shadowwalkerzero/embed/PpaGxb/?height=400&theme-id=0&default-tab=result,result&embed-version=2)

##第一步 画球
如何设置球上的点？
 
我的思路是: 给这个球画上经纬线。

这里画一个草图
 ![Image](https://github.com/FounderIsShadowWalker/particalAniamtion/blob/master/3d/img/pic_1.png)
需要注意的有经线和纬线之间的间隔必须是一致。最简单的方案就是以角度划分了。也就是A到B, B到C的距离必须是一样的，因为它们在不同纬度上的角度不同，即 <AoC = <AoB

代码很好写，我们试着写一下(具体代码请上codepen) 
第一部分先画不同纬度的圆周，注意要分z的上下限。

	var    LayerBallNum = 360 / 30,      // 横向圆周个数
    		LayerIntervalUp = 360 / 30;    //纵向
    		
    		var Animation = function(){
        this.init();
    };

    Animation.prototype = {
        isrunning: false,
        init: function () {
            var num = LayerIntervalUp / 2;     //layer 的数目  画上半球  下半球
            for (var i = 0; i <=num; i++) {
                var l = new layer(i, 1);
                l.draw();
                var l = new layer(i, -1);
                l.draw();
            }
		}
     ｝
       var layer = function (num, up) {
        this.radius = Math.sqrt(Math.pow(Radius,2) - Math.pow(Radius * Math.cos(num * Math.PI * 2 / LayerBallNum), 2))		  ／／设定不同经度上的圆周半径
        this.x = 0;
        this.y = 0;
        this.up = up;
    }
 我们看看画出来的俯视图
 ![Image](https://github.com/FounderIsShadowWalker/particalAniamtion/blob/master/3d/img/pic_2.png)

 
 之后我们再在这个圆周上放球，注意前面说的不同纬度，经度上相邻的两个点角度一致,对于不同球来说，z轴越大 透明度 z-index 就越大，因为z轴是垂直屏幕的轴，上关键代码。

    layer.prototype = {
        setBalls: function (radius) {
            for(var i=0; i<LayerBallNum; i++){
                var angle =  2 * Math.PI / LayerBallNum * i;
                var b = new ball(radius * Math.cos(angle), radius * Math.sin(angle), this.up * Math.sqrt(Math.pow(Radius, 2) - Math.pow(radius, 2)), 1.5);
                b.paint();
                balls.push(b);
            },
	draw: function () {
	            ctx.beginPath();
	            ctx.arc(vpx, vpy, this.radius , 0, 2*Math.PI, true);
	            ctx.strokeStyle = "#FFF";
	            ctx.stroke();
	            this.setBalls(this.radius);
	        }
        }
        
  
    var ball = function(x , y , z , r){
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.width = 2*r;
    }

    ball.prototype = {
        paint:function(){
            var fl = 450 //焦距
            ctx.save();
            ctx.beginPath();
            var scale = fl / (fl - this.z);
            var alpha = (this.z+Radius)/(2*Radius);
            ctx.arc(vpx + this.x, vpy + this.y, this.r*scale , 0 , 2*Math.PI , true);
            ctx.fillStyle = "rgba(255,255,255,"+(alpha+0.5)+")";
            ctx.fill();
            ctx.restore();
        }
    }      

我们看看画出来的球，俯视图。

 ![Image](https://github.com/FounderIsShadowWalker/particalAniamtion/blob/master/3d/img/pic_3.png)

##第二步 旋转
怎么旋转呢？其实3维的坐标系我们已经构建出来了，z轴的表示就是投影在屏幕上的缩放比，z-index差异，该怎么旋转呢？

这里就要掏出初中数学课本，来给大家推导一下了。
 ![Image](https://github.com/FounderIsShadowWalker/particalAniamtion/blob/master/3d/img/pic_4.png)

	//绕z轴为例
	x=rcos(b)  y=rsin(b)
	x1=rcos(b+c) y1=rsin(b+c)
	x1=xcosb - ysinc = rcosbcosc - rsinbsinc  
    y1= ycosb + xsinc = rsinbcosc + rcosbsinc  
    
看看具体的代码:

	 function rotateZ(){
        var cos = Math.cos(angleY);
        var sin = Math.sin(angleY);
        for(var i=0;i<balls.length;i++){
            var x1 = balls[i].x * cos - balls[i].y * sin;
            var y1 = balls[i].y * cos + balls[i].x * sin;
            balls[i].x = x1;
            balls[i].y = y1;
        }
    }    

##最后一点补充
1.加上暂停

这个很简单 在animation里设定一个flag就好，表示状态

3.鼠标引导方向

给canvas榜上mousemove方向，当你鼠标滑过canvas的时候，拿当时落在canvas的点和canvas的中心点(球的中心点)比较，判断旋转方向。具体代码请在codepen上阅读，在此感谢waxes大神在博客园上的文章。