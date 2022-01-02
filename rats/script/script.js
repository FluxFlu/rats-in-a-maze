
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext("2d");

class rat {
    static rats = [];

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 50;
        this.age = 0;
        this.fed = 300;
        this.sex = Math.floor(Math.random() * 2)
    }
    kill() {
        rat.rats.splice(rat.rats.indexOf(this), 1);
    }
    move() {
        const walls = [
            wall.walls.filter(e => e.x == this.x - 50 && e.y == this.y).length > 0,
            wall.walls.filter(e => e.x == this.x + 50 && e.y == this.y).length > 0,
            wall.walls.filter(e => e.x == this.x && e.y == this.y - 50).length > 0,
            wall.walls.filter(e => e.x == this.x && e.y == this.y + 50).length > 0
        ];
        let nearestCheese = false;
        let nearestCheeseDistance = 100;
        for (let x = 0; x < cheese.cheeses.length; x++) {
            const xDist = Math.abs(cheese.cheeses[x].x - this.x);
            const yDist = Math.abs(cheese.cheeses[x].y - this.y);
            const distance = Math.sqrt(xDist ** 2 + yDist ** 2);
            if (distance < nearestCheeseDistance) {
                nearestCheese = cheese.cheeses[x];
                nearestCheeseDistance = distance;
            }
        }
        let hori = nearestCheese.x - this.x > 0;
        let verti = nearestCheese.y - this.y > 0;
        if (hori && walls[1]) hori = 0;
        if (!hori && walls[0]) hori = 1;
        if (walls[0] && walls[1])
            hori = -1;

        if (verti && walls[3]) verti = 0;
        if (!verti && walls[2]) verti = 1;
        if (walls[2] && walls[3])
            verti = -1;

        if (hori == -1 && verti == -1) return;

        if (hori == -1) {
            if (verti)
                return this.y += 50;
            else
                return this.y -= 50;
        }
        else if (verti == -1) {
            if (hori)
                return this.x += 50;
            else
                return this.x -= 50;
        }
        else {
            if (Math.random() > 0.5) {
                if (hori)
                    return this.x += 50;
                else
                    return this.x -= 50;
            } else {
                if (verti)
                    return this.y += 50;
                else
                    return this.y -= 50;
            }
        }
    }
    reproduce() {
        if (this.sex == 1 && rat.rats.filter(e => e.sex == 0).length > 0 && Math.random() > 0.975)
            rGenItem(rat, rat.rats);
    }
    update() {
        ctx.drawImage(document.getElementById("rat"), this.x, this.y, this.w, this.h);

        this.move();

        this.reproduce();

        cheese.cheeses.forEach(e => {
            if (e.x == this.x && e.y == this.y) {
                cheese.cheeses.splice(cheese.cheeses.indexOf(e), 1);
                this.fed += 50;
            }
        });
        this.fed -= 5;
        this.age++;
        if ((this.age > 60 && Math.random() > 0.5) || this.fed <= 0)
            this.kill();
    }
}

class wall {
    static walls = [];

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 50;
    }

    update() {
        ctx.fillStyle = "#111";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class cheese {
    static cheeses = [];

    static cheeseTimer = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 50;
    }

    molder() {
        const cheeses = [
            cheese.cheeses.filter(e => e.x == this.x - 50 && e.y == this.y).length,
            cheese.cheeses.filter(e => e.x == this.x + 50 && e.y == this.y).length,
            cheese.cheeses.filter(e => e.x == this.x && e.y == this.y - 50).length,
            cheese.cheeses.filter(e => e.x == this.x && e.y == this.y + 50).length,
            cheese.cheeses.filter(e => e.x == this.x - 50 && e.y == this.y - 50).length,
            cheese.cheeses.filter(e => e.x == this.x + 50 && e.y == this.y + 50).length,
            cheese.cheeses.filter(e => e.x == this.x + 50 && e.y == this.y - 50).length,
            cheese.cheeses.filter(e => e.x == this.x - 50 && e.y == this.y + 50).length
        ];
        if (cheeses.filter(e => e > 0).length > 3) {
            cheese.cheeses.splice(cheese.cheeses.indexOf(this), 1);
            rat.rats.push(new rat(this.x, this.y));
        }
    }

    static update() {
        this.cheeseTimer++;
        if (this.cheeseTimer > 0) {
            rGenItem(this, this.cheeses);
            this.cheeseTimer = 0;
        }
    }

    update() {
        ctx.drawImage(document.getElementById("cheese"), this.x, this.y, this.w, this.h);
        this.molder();
    }
}

function rGenItem(item, list) {
    if (wall.walls.length + rat.rats.length + cheese.cheeses.length >= 144)
        return false;
    let x = Math.floor(Math.random() * 12) * 50;
    let y = Math.floor(Math.random() * 12) * 50;
    while (wall.walls.filter(e => e.x == x && e.y == y).length > 0 || cheese.cheeses.filter(e => e.x == x && e.y == y).length > 0 || rat.rats.filter(e => e.x == x && e.y == y).length > 0) {
        x = Math.floor(Math.random() * 12) * 50;
        y = Math.floor(Math.random() * 12) * 50;
    }
    list.push(new item(x, y));
}

for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
        if (Math.random() < 0.3)
            wall.walls.push(new wall(x * 50, y * 50));
    }
}
for (let x = 0; x < 12; x++) {
    wall.walls.push(new wall(x * 50, -50))
}
for (let x = 0; x < 12; x++) {
    wall.walls.push(new wall(x * 50, 600))
}
for (let x = 0; x < 12; x++) {
    wall.walls.push(new wall(-50, x * 50))
}
for (let x = 0; x < 12; x++) {
    wall.walls.push(new wall(600, x * 50))
}

while (rat.rats.length < 15)
    rGenItem(rat, rat.rats);
for (let x = 0; x < rat.rats.length; x++) {
    rat.rats[x].age = Math.floor(Math.random * 10);
}

while (cheese.cheeses.length < 25)
    rGenItem(cheese, cheese.cheeses);

ctx.fillStyle = "#2a2a2a";
ctx.fillRect(0, 0, canvas.width, canvas.height);
setInterval(() => {
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    cheese.update();
    wall.walls.forEach(r => r.update());
    rat.rats.forEach(r => r.update());
    cheese.cheeses.forEach(r => r.update());
    document.getElementById("counter").innerHTML = `Number of rats: ${rat.rats.length}<br><br>Number of blocks of cheese: ${cheese.cheeses.length}`;
}, 300);