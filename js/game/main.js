var world = new World();
var worldRender = new WorldRender(world);
var worldController = new WorldController(world);
var collisionController = new CollisionController(world);


var player = new Player(300,300,10,10,0,0);
var keyController = new KeyController(player,5,4,3,3);

world.add(player);

world.add(new Box(0, 400, 20, 500, 0, 0));
world.add(new Box(30, 350, 20, 200, 0, 0));
world.add(new Box(100, 300, 20, 40, 0, 0));
world.add(new Box(200, 250, 20, 40, 0, 0));
world.add(new Box(100, 200, 20, 40, 0, 0));
world.add(new Box(200, 150, 20, 20, 0, 0));
world.add(new Box(300, 150, 20, 100, 0, 0));

var key = new Key(350, 140, 10, 10, 0, 0);

world.add(key);

var finish = true;
var time = new Date().getTime();


//MAIN LOOP
setInterval(function() { 

    keyController.run();


    player.rectangle.point.x += player.velocity.vx;
    player.rectangle.point.y += player.velocity.vy;

    player.velocity.vy *= 0.99;
    player.velocity.vx *= 0.90;

    player.velocity.vy += 0.15;

    if(player.rectangle.point.y > 390){
        player.velocity.vy = 0;
        player.velocity.vx *= 0.90;
    }



    if(key.rectangle.collide(player.rectangle) != "null" && finish){

        finish = false;
        var score = getTime(time);

        $('.glyphicon-ok').fadeIn();

        //alert("Your time is "+score+" ms");
    }

    collisionController.run(player);

    clearCanvas("#231e76");
    worldRender.draw();

}, 1000 / 60);


function getTime(time){
    var currentTime = new Date().getTime();
    return currentTime - time; 
}