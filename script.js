const canvas = document.getElementById("canvas")

let ctx = canvas.getContext("2d")

let width = canvas.width
let height = canvas.height

let Player = function (x, y) {
    this.x = x;
    this.y = y;

    this.xSpeed = 0;
    this.ySpeed = 0;

    this.angle = Math.PI / 4

    this.direction = true;

    this.charge = false;
    this.gauge = 0
    this.gaugeDirection = true;

    this.hp = 100
}

Player.prototype.move = function() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
}

Player.prototype.draw = function () { 
    const d = this.direction ? 1 : -1
    ctx.strokeStyle = "black"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.x - 15, this.y)
    ctx.lineTo(this.x - 15, this.y - 30)
    ctx.lineTo(this.x + 15, this.y - 30)
    ctx.lineTo(this.x + 15, this.y)
    ctx.lineTo(this.x, this.y)
    ctx.stroke()
    ctx.moveTo(this.x, this.y - 15)
    ctx.lineTo(this.x + d * 40 * Math.cos(this.angle), this.y - 15 - 40 * Math.sin(this.angle))
    ctx.stroke()

    if (this.charge) { 
        ctx.strokeStyle = "white"
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.moveTo(this.x - 20, this.y + 20)
        ctx.lineTo(this.x + 20, this.y + 20)
        ctx.stroke()
    
        ctx.strokeStyle = "red"
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(this.x - 20, this.y + 20)
        ctx.lineTo(this.x - 20 + 40 * (this.gauge/100) , this.y + 20)
        ctx.stroke()
    }
}

Player.prototype.shot = function () { 
    const d = this.direction ? 1 : -1
    const xPos = this.x + d * 40 * Math.cos(this.angle)
    const yPos = this.y - 15 - 40 * Math.sin(this.angle)
    const xS = xPos - this.x
    const yS = yPos - this.y
    shots.push(new Shot(xPos, yPos, xS * this.gauge / 100, yS * this.gauge / 100))
}

let Shot = function (x, y, xSpeed, ySpeed) { 
    this.x = x
    this.y = y
    this.xSpeed = xSpeed
    this.ySpeed = ySpeed
}

Shot.prototype.move = function () { 
    this.x += this.xSpeed
    this.y += this.ySpeed
    this.ySpeed += 2
}

Shot.prototype.draw = function () { 
    ctx.fillStyle = 'black'
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
    ctx.fill();
}

let player = new Player(100, 600);
let shots = []

const init = () => { 
    canvas.width = innerWidth
    canvas.height = innerHeight

}

const handleKeyboard = (e) => { 
    console.log(e)
    if (e.key === "ArrowLeft") {
        player.xSpeed = -5
        player.direction = false
    } else if (e.key === "ArrowRight") {
        player.xSpeed = 5
        player.direction = true
    } else if (e.key === "ArrowUp") {
        player.angle += Math.PI / 90
        if (player.angle > Math.PI / 2) {
            player.angle = Math.PI / 2
        }
    } else if (e.key === "ArrowDown") {
        player.angle -= Math.PI / 90
        if (player.angle < 0) {
            player.angle = 0
        }
    } else if (e.key === " ") { 
        player.charge = true
        if (player.gaugeDirection) {
            player.gauge += 4
            if (player.gauge > 100) {
                player.gauge = 100
                player.gaugeDirection = false
            }
        } else { 
            player.gauge -= 4
            if (player.gauge < 0) {
                player.gauge = 0
                player.gaugeDirection = true
            }
        }
    }
}

const handleKeyUp = (e) => { 
    console.log(e)
    if (e.key === 'ArrowLeft' || e.key === "ArrowRight") {
        player.xSpeed = 0
    } else if (e.key === " ") { 
        player.charge = false
        player.shot()
        player.gauge = 0
    }
}

const animate = () => { 
    requestAnimationFrame(animate)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillRect(0, 600, canvas.width, canvas.height - 600)
    player.move();
    player.draw();

    for (shot of shots) { 
        shot.move()
        shot.draw()
    }
}

if (canvas) {
    init();
    addEventListener("resize", init)
    addEventListener("keydown", handleKeyboard)
    addEventListener("keyup", handleKeyUp)
    animate()
}