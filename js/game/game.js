
//CONFIG
var VERSION = 0.2;

//CONSTANT
var cons = {
    fx: 0.99,
    fy: 0.99,
    elasticity: 0.5,
    gravity: 0.15
};

var physique = {
    fx: cons.fx,
    fy: cons.fy,
    elasticity: cons.elasticity,
    gravity: cons.gravity
};

//INIT

//canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 380;
canvas.height = 420;
//===========================================================

//KEY CONTROL

//keyboard constants
var KEY = {
    A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71,
    H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78,
    O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85,
    V: 86, W: 87, X: 88, Y: 89, Z: 90,
    LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, SPACE: 32,
    ESC: 27, PGUP: 33, PGDOWN: 34, HOME: 36, END: 35,
    0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53,
    6: 54, 7: 55, 8: 56, 9: 57
};

//KEY
var commande = {
    up: false,
    down: false,
    left: false,
    right: false
};

//Push on key
window.onkeydown = function(event) {

    // On récupère le code de la touche
    var e = event || window.event;
    var key = e.which || e.keyCode;

    if (key == KEY.UP) {
        commande.up = true;
    }

    if (key == KEY.DOWN) {
        commande.down = true;
    }

    if (key == KEY.LEFT) {
        commande.left = true;
    }

    if (key == KEY.RIGHT) {
        commande.right = true;
    }

    return false;
};


//Unpress on key
window.onkeyup = function(event) {

    // On récupère le code de la touche
    var e = event || window.event;
    var key = e.which || e.keyCode;

    if (key == KEY.UP) {
        commande.up = false;
    }

    if (key == KEY.DOWN) {
        commande.down = false;
    }

    if (key == KEY.LEFT) {
        commande.left = false;
    }

    if (key == KEY.RIGHT) {
        commande.right = false;
    }

    return false;
};


//KeyController
function KeyController(player, vu, vd, vl, vr){

    this.vu = vu;
    this.vd = vd;
    this.vl = vl;
    this.vr = vr;
    
    this.run = function(){

        if (commande.up && !player.state.jump) {
            player.velocity.vy = -this.vu;
            player.state.jump = true;
        }

        if (commande.down) {
            //player.velocity.vy = this.vd;
        }

        if (commande.left) {
            player.velocity.vx = -this.vl;
        }

        if (commande.right) {
            player.velocity.vx = this.vr;
        }
    };
}

//================================================================
//WORLD

//World
function World() {

    this.entities = new Array();

    this.add = function(entity) {
        this.entities.push(entity);
    };

    this.remove = function(entity) {
    };
}


//WorldRender
function WorldRender(world) {

    this.world = world;

    this.draw = function() {


        this.world.entities.forEach(function(value, index, array) {


            if (value.name == "carre") {

                ctx.save();
                ctx.fillStyle = value.color;
                ctx.fillRect(value.rectangle.point.x, value.rectangle.point.y, value.rectangle.w, value.rectangle.h);
                ctx.restore();

            } else if (value.name == "player") {

                ctx.save();
                ctx.fillStyle = value.color;
                ctx.fillRect(value.rectangle.point.x, value.rectangle.point.y, value.rectangle.w, value.rectangle.h);
                ctx.restore();

            } else if(value.name == "circle"){

               ctx.beginPath();
               ctx.arc(value.rectangle.point.x, value.rectangle.point.y, value.rectangle.h, 0, Math.PI*2, true); 
               ctx.closePath();
               ctx.fill();

            } else if(value.name == "key"){

                ctx.save();
                ctx.fillStyle = value.color;
                ctx.fillRect(value.rectangle.point.x, value.rectangle.point.y, value.rectangle.w, value.rectangle.h);
                ctx.restore();
           }

       });
    };

}



//WorldController
function WorldController(world) {

    this.world = world;

    this.update = function() {
        this.world.entities.forEach(test);
    };
}

function CollisionController(world) {

    this.world = world;

    this.run = function(player) {
        this.world.entities.forEach(this.loop);
    };

    this.loop = function(entity, index, array){
        collide(player, entity);
    };

    function collide(creature, entity) {

        if (entity.rectangle.collide(creature.rectangle) != "null") {

            if (entity.rectangle.collide(creature.rectangle) == "down") {
                creature.rectangle.point.y = entity.rectangle.positionBordureDown(creature.rectangle);
                creature.velocity.vy = Math.ceil((Math.abs(creature.velocity.vy)));
                //creature.velocity.vy = 0
            }

            if (entity.rectangle.collide(creature.rectangle) == "up") {
                creature.rectangle.point.y = entity.rectangle.positionBordureUp(creature.rectangle);
                //creature.velocity.vy = math.ceil((-math.fabs(creature.velocity.vy)))
                creature.velocity.vy = 0;

                creature.state.jump = false;
            }

            if (entity.rectangle.collide(creature.rectangle) == "left") {
                creature.rectangle.point.x = entity.rectangle.positionBordureLeft(creature.rectangle);
                //creature.velocity.vx = math.ceil((-math.fabs(creature.velocity.vx)))
                creature.velocity.vx = 0;

                creature.state.jump = false;
            }

            if (entity.rectangle.collide(creature.rectangle) == "right") {
                creature.rectangle.point.x = entity.rectangle.positionBordureRight(creature.rectangle);
                //creature.velocity.vx = math.ceil((-math.fabs(creature.velocity.vx)))
                creature.velocity.vx = 0;

                creature.state.jump = false;
            }
        }
    };
}


//Camera
function Camera(x, y, h, w) {

    this.cadre = new Rectangle(x, y, h, w);
    this.i = x;
    this.j = y;
}


function Map() {

    this.creatures = new Array();
    this.tiles = new Array();

    this.addCreature = function(creature) {
        this.creatures.push(creature);
    };

    this.addTile = function(tile) {
        this.tiles.push(tile);
    };
}



//================================================================
//COMPOSANT


//State
function State() {
    this.jump = true;
}


//Point
function Point(x, y) {

    this.x = x;
    this.y = y;

    //Calcul distance between point A and B
    this.distance = function(other) {
        return Math.sqrt(Math.pow((other.x - this.x), 2) + Math.pow((other.y - this.y), 2));
    };

    //Position of right angle in a right triangle
    this.getPositionO = function(lol) {
        return new Point(this.x, lol.y);
    };

    //get side A in a right triangle
    this.getA = function(other) {
        return this.distance(this.getPositionO(other));
    };

    this.getB = function(other) {
        return this.getPositionO(other).distance(other);
    };

    //Distance with an other Rectangle (C)
    this.getC = function(other) {
        return this.distance(other);
    };

    this.getAngleSuperficiel = function(other) {
        // a/c = Sin A
        return toDegrees(Math.asin(this.getA(other) / this.getC(other)));
    };

    this.positionOfOther = function(other) {
        //UP, DOWN, LEFT, RIGHT
        var position = [];
        if (this.x <= other.x) {
            position[0] = "right";
        }

        if (this.x > other.x) {
            position[0] = "left";
        }

        if (this.y <= other.y) {
            position[1] = "down";
        }

        if (this.y > other.y) {
            position[1] = "up";
        }

        return position;
    };

    this.getAngle = function(other) {
        var angle = this.getAngleSuperficiel(other);
        var position = this.positionOfOther(other);

        if (position[1] == "up" && position[0] == "left") {
            angle = 180 - angle;
        }

        if (position[1] == "down" && position[0] == "left") {
            angle = 180 + angle;
        }

        if (position[1] == "down" && position[0] == "right") {
            angle = 360 - angle;
        }

        return angle;
    };
}


//Rectangle
function Rectangle(x, y, h, w) {

    this.point = new Point(x, y);
    this.w = w;
    this.h = h;

    this.getCentre = function() {
        return new Point(this.point.x + this.w / 2, this.point.y + this.h / 2);
    };

    this.getAngle = function(other) {
        return this.getCentre().getAngle(other.getCentre());
    };

    //get side A in a right triangle
    this.getA = function(other) {
        return this.getCentre().getA(other.getCentre());
    };

    this.getB = function(other) {
        return this.getCentre().getB(other.getCentre());
    };

    this.distanceCentreParoiVertical = function() {
        return this.getCentre().distance(new Point(this.getCentre().x, this.point.y));
    };

    this.distanceCentreParoiHorizontal = function() {
        return this.getCentre().distance(new Point(this.point.x, this.getCentre().y));
    };

    this.distanceEffectiveVertical = function(other) {
        return this.getA(other) - this.distanceCentreParoiVertical() - other.distanceCentreParoiVertical();
    };

    this.distanceEffectiveHorizontal = function(other) {
        return this.getB(other) - this.distanceCentreParoiHorizontal() - other.distanceCentreParoiHorizontal();
    };

    this.positionBordureUp = function(other) {
        return this.point.y - other.h;
    };

    this.positionBordureDown = function(other) {
        return this.point.y + this.h;
    };

    this.positionBordureRight = function(other) {
        return this.point.x + this.w;
    };

    this.positionBordureLeft = function(other) {
        return this.point.x - other.w;
    };

    //Check the collision and the collision side
    this.collide = function(other) {
        side = "null";
        if (this.distanceEffectiveVertical(other) <= 0 && this.distanceEffectiveHorizontal(other) <= 0) {

            if ((this.getAngle(other) < this.angleLeftUp()) && (this.getAngle(other) > this.angleRightUp())) {
                side = "up";
            }

            if ((this.getAngle(other) > this.angleLeftDown()) && (this.getAngle(other) < this.angleRightDown())) {
                side = "down";
            }
            if ((this.getAngle(other) > this.angleLeftUp()) && (this.getAngle(other) < this.angleLeftDown())) {
                side = "left";
            }
            if ((this.getAngle(other) < this.angleRightUp() && this.getAngle(other) >= 0) || (this.getAngle(other) > this.angleRightDown() && this.getAngle(other) <= 360)) {
                side = "right";
            }
        }
        return side;
    };


    this.angleLeftUp = function() {
        return this.getCentre().getAngle(this.point);
    };

    this.angleRightUp = function() {
        return this.getCentre().getAngle(new Point(this.point.x + this.w, this.point.y));
    };

    this.angleRightDown = function() {
        return this.getCentre().getAngle(new Point(this.point.x + this.w, this.point.y + this.h));
    };

    this.angleLeftDown = function() {
        return this.getCentre().getAngle(new Point(this.point.x, this.point.y + this.h));
    };

}



//Frotement
function Frotement(fx, fy) {
    this.fx = fx;
    this.fy = fy;
}

//Velocity
function Velocity(vx, vy) {
    this.vx = vx;
    this.vy = vy;
}


//================================================================
//ENTITY

//Entity
function Entity(name, x, y, h, w) {
    this.name = name
    this.rectangle = new Rectangle(x, y, h, w)
}


//Player
function Player(x, y, h, w, vx, vy) {
    this.base = Entity;
    this.base("player", x, y, h, w);
    this.velocity = new Velocity(vx, vy);
    this.state = new State();
    this.color = "#ff6600";
}
Player.prototype = new Entity;

//Circle
function Circle(x, y, h, vx, vy) {
    this.base = Entity;
    this.base("circle", x, y, h, 0);
    this.velocity = new Velocity(vx, vy);
}
Circle.prototype = new Entity;

//Box
function Box(x, y, h, w, vx, vy, color) {
    this.base = Entity;
    this.base("carre", x, y, h, w);
    this.color = "white";
}
Box.prototype = new Entity;

//Key
function Key(x, y, h, w, vx, vy) {
    this.base = Entity;
    this.base("key", x, y, h, w);
    this.color = "#ff6600";
}
Box.prototype = new Entity;


//UTIL

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

function clearCanvas(color){
    // Clear display
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}