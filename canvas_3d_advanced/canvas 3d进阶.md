# Canvas  进阶学习

 前些日子在codepen上看到了一个很惊艳的3d特效，一时惊叹，fork下来后，读了一下作者的源码，200多行，十分精简，但是内劲无穷。这里和大家分享一下作者的思路和一些基础的数学知识，
 希望能给大家带来一点思考和启发，这里放上codepen的地址
 
 [源码地址](http://codepen.io/shadowwalkerzero/pen/PmQJON)
 
 ### 效果图
 <!--<div  style="margin-bottom: 20px;">
 <iframe height='500' scrolling='no' title='deformable particles' src='http://codepen.io/shadowwalkerzero/embed/PmQJON/?height=265&theme-id=0&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/shadowwalkerzero/pen/PmQJON/'>deformable particles</a> by shadowwalkerzero (<a href='http://codepen.io/shadowwalkerzero'>@shadowwalkerzero</a>) on <a href='http://codepen.io'>CodePen</a>.
 </iframe></div>-->

### 动画生成过程
> 1.  创建canvas  设置canvas中心点  变量初始化  => function setParameters

> 2.  生成指定数量的例子 同时完成例子的初始化(设置粒子x,y,z 以及增量vx,vy,vz) =>
      function createParticles

> 3.  初始化不同形状 => function setupFigure

> 4.  给click(立即切换到下一图形) 和 onmouseover(旋转) 绑定this 因为addEventListener 会把this 绑定在dom上  => function reconstructMethod

> 5. bindEvent 给 click(立即切换到下一图形) 和 onmouseover(旋转) 绑定事件

> 6. 绘图 => function drawFigure

*其中涉及坐标旋转的代码可以参照之前3d旋转球的博文 有详细说明 这里不做赘述*

[3d旋转球](https://github.com/FounderIsShadowWalker/particalAniamtion/blob/master/3d/3d_circle.md)

## 重点 (绘图: drawFigure)
> 1 球体 在之前的博文里提到过，不做赘述.

> 2 环形 看看源码里的环形公式

```
 createTorus : function(){
        var theta = Math.random() * Math.PI * 2,
            x = this.SCATTER_RADIUS + this.SCATTER_RADIUS / 6 * Math.cos(theta),
            y = this.SCATTER_RADIUS / 6 * Math.sin(theta),
            phi = Math.random() * Math.PI * 2;

        return {
            x : x * Math.cos(phi),
            y : y,
            z : x * Math.sin(phi),
            hue : Math.round(phi / Math.PI * 30)
        };
    }
```

环形 x y z 推导 (x 屏幕面的x方向， y 屏幕面的y方向， z 垂直于屏幕面的方向)

![Image](https://github.com/FounderIsShadowWalker/particalAniamtion/blob/master/canvas_3d_advanced/img/torus.png)

- 环形的z轴是相对屏幕对称的 


> 3 圆锥 看看源码里的公式

```
    createCone : function(){
        var status = Math.random() > 1 / 3,
            x,
            y,
            phi = Math.random() * Math.PI * 2,
            rate = Math.tan(30 / 180 * Math.PI) / this.CONE_ASPECT_RATIO;

        if(status){
            y = this.SCATTER_RADIUS * (1 - Math.random() * 2);
            x = (this.SCATTER_RADIUS - y) * rate;
        }else{
            y = -this.SCATTER_RADIUS;
            x = this.SCATTER_RADIUS * 2 * rate * Math.random();
        }
        return {
            x : x * Math.cos(phi),
            y : y,
            z : x * Math.sin(phi),
            hue : Math.round(phi / Math.PI * 30)
        };
    },
```
![Image](https://github.com/FounderIsShadowWalker/particalAniamtion/blob/master/canvas_3d_advanced/img/cons.png)
这里 tana 被作者替换成 1.5 tan30， 这里我们可以理解为a 为30，宽高比为1.5.

>4 花瓶形(不知道数学里叫什么) 看看源码里的公式

```
    createVase : function(){
        var theta = Math.random() * Math.PI,
            // x = Math.abs(this.SCATTER_RADIUS * Math.cos(theta) / 2) + this.SCATTER_RADIUS / 8,
            x = Math.abs(this.SCATTER_RADIUS * Math.cos(theta) / 2) + this.SCATTER_RADIUS / 8,
            y = this.SCATTER_RADIUS * Math.cos(theta) * 1.2,
            phi = Math.random() * Math.PI * 2;

        return {
            x : x * Math.cos(phi),
            y : y,
            z : x * Math.sin(phi),
            hue : Math.round(phi / Math.PI * 30)
        };
    }
```
![Image](https://github.com/FounderIsShadowWalker/particalAniamtion/blob/master/canvas_3d_advanced/img/vase.png)

###结语
canvas 3d 坐标转换可谓基础，掌握好canvas坐标转换，配合图形的三维方程，可以让粒子做出美妙的运动，释放无穷尽的想象。