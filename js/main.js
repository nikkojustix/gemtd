import Game from "./Game.js";
import { loadImage, loadJSON } from "./Loader.js";
import Sprite from "./Sprite.js";
import DisplayObject from "./DisplayObject.js";
import Tower from "./Tower.js";
import Enemy from "./Enemy.js";
import Bullet from "./Bullet.js";
import { haveCollision } from "./Additional.js";

export default async function main() {
  const atlas = await loadJSON("/json/atlas.json");
  const images = await loadImage("images/spritesheet.svg");
  const scale = atlas.board.size;
  const maze = new Array();
  const enemies = new Array();
  let roundLevel = 1;
  const container = document.querySelector(".container");
  const round = document.querySelector(".round__number");
  const ranks = Object.keys(atlas.chances[roundLevel]);
  const waypoints = Object.values(atlas.waypoints);
  const zones = Object.values(atlas.startFinish);
  const roads = Object.values(atlas.roads);

  let paths;

  const tempSpeed = 1;

  let phase = 0;

  let currentChanceLevel = 0;
  let chances = [0, 0, 0, 0, 0];
  const showArea = document.querySelector(".selected-item");
  const descrArea = document.querySelector(".description");

  const game = new Game({
    rows: atlas.board.rows,
    cols: atlas.board.cols,
    squareSize: scale,
    background: "#ddd",
  });
  container.insertBefore(game.canvas, container.firstChild);

  const grid = new PF.Grid(game.rows, game.cols);
  const finder = new PF.AStarFinder();

  zones.forEach((point) => {
    game.stage.add(
      new DisplayObject({
        x: point.x * scale,
        y: point.y * scale,
        width: point.width * scale,
        height: point.height * scale,
        fillStyle: "hsl(0, 100%, 50%, 0.5)",
      })
    );
  });

  roads.forEach((road) => {
    game.stage.add(
      new DisplayObject({
        x: road.x * scale,
        y: road.y * scale,
        width: road.width * scale,
        height: road.height * scale,
        fillStyle: "hsl(60, 60%, 60%, 0.3)",
      })
    );
  });

  waypoints.forEach((point) => {
    game.stage.add(
      new DisplayObject({
        x: point.x * scale,
        y: point.y * scale,
        width: point.width * scale,
        height: point.height * scale,
        fillStyle: "hsl(0, 90%, 60%, 1)",
      })
    );
  });

  const buildBtn = document.querySelector(".build");
  const removeBtn = document.querySelector(".remove");
  const selectBtn = document.querySelector(".select");
  const downgradeBtn = document.querySelector(".downgrade");
  const combineBtn = document.querySelector(".combine");
  const combineDoubleBtn = document.querySelector(".combine2");
  const specialBtn = document.querySelector(".special");

  const selectControls = new Array();
  selectControls.push(selectBtn);
  selectControls.push(downgradeBtn);
  selectControls.push(combineBtn);
  selectControls.push(combineDoubleBtn);
  selectControls.push(specialBtn);

  let gemCounter = 1;

  function startRound() {
    round.innerHTML = roundLevel;
    setChances(roundLevel);
    buildBtn.addEventListener("click", buildPhase);
    removeBtn.addEventListener("click", removePhase);
  }

  function setChances() {
    if (atlas.chances[roundLevel]) {
      chances = Object.values(atlas.chances[roundLevel]);
    }
  }

  const buildPhase = function () {
    phase = 0;
    game.canvas.addEventListener("click", buildGem);
  };

  const buildGem = function (e) {
    const pos = getPostion(e);
    if (buildingBlocked(pos)) return;
    getRandomGem(pos);

    if (gemCounter == 5) {
      buildBtn.removeEventListener("click", buildPhase);
      gemCounter = 0;
      game.canvas.removeEventListener("click", buildGem);
    }
    gemCounter++;
    // game.canvas.removeEventListener("click", buildGem);
  };

  function getPostion(e) {
    const rect = game.canvas.getBoundingClientRect();
    let pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    pos.x -= pos.x % scale;
    pos.y -= pos.y % scale;

    return pos;
  }

  function buildingBlocked(pos) {
    for (const points in waypoints) {
      if (Object.hasOwnProperty.call(waypoints, points)) {
        const point = waypoints[points];
        if (
          point.x * scale <= pos.x &&
          pos.x <= (point.x + point.width - 1) * scale &&
          point.y * scale <= pos.y &&
          pos.y <= (point.y + point.height - 1) * scale
        ) {
          alert("нельзя строить здесь");
          return true;
        }
      }
    }
    for (const points in zones) {
      if (Object.hasOwnProperty.call(zones, points)) {
        const point = zones[points];
        if (
          point.x * scale <= pos.x &&
          pos.x <= (point.x + point.width - 1) * scale &&
          point.y * scale <= pos.y &&
          pos.y <= (point.y + point.height - 1) * scale
        ) {
          alert("нельзя строить здесь");
          return true;
        }
      }
    }

    for (const walls in maze) {
      if (Object.hasOwnProperty.call(maze, walls)) {
        const wall = maze[walls];
        if (pos.x == wall.x && pos.y == wall.y) {
          alert("нельзя построить здесь");
          return true;
        }
      }
    }
    return false;
  }

  function getRandomGem(pos) {
    const gems = Object.keys(atlas.gems);
    const randGem = gems[Math.floor(gems.length * Math.random())];
    const randRank = getRandomRank();

    const randomGem = new Tower({
      image: images,
      frame: {
        x: atlas.gems[randGem][randRank].x,
        y: atlas.gems[randGem][randRank].y,
        width: 20,
        height: 20,
      },
      x: pos.x,
      y: pos.y,
      width: scale,
      height: scale,
      name: atlas.gems[randGem][randRank].name,
      range: atlas.gems[randGem][randRank].range * scale,
      type: randGem,
      rank: randRank,
      damage: atlas.gems[randGem][randRank].damage,
      ability: atlas.gems[randGem][randRank].ability,
      attackSpeed: atlas.gems[randGem][randRank].attackSpeed,
      new: true,
    });

    grid.setWalkableAt(randomGem.x / scale, randomGem.y / scale, false);

    game.stage.add(randomGem);
    maze.push(randomGem);
  }

  function getRandomRank() {
    if (roundLevel in atlas.chances) {
      currentChanceLevel = roundLevel;
    }
    const rand = Math.random();
    for (let i = 0; i < chances.length; i++) {
      if (rand < chances[i]) {
        return Object.keys(atlas.chances[currentChanceLevel]).filter(
          (key) => atlas.chances[currentChanceLevel][key] === chances[i]
        );
      }
    }
  }

  const selectItem = function (e) {
    const pos = getPostion(e);
    hideSelectControls();
    for (const items in maze) {
      if (Object.hasOwnProperty.call(maze, items)) {
        const item = maze[items];
        item.selected = false;

        if (item.x == pos.x && item.y == pos.y) {
          while (showArea.firstChild) showArea.removeChild(showArea.firstChild);
          showArea.append(item.image);
          console.log(item.attackSpeed);
          showDescription(item);
          item.selected = true;
          if (item.new && gemCounter == 1) {
            showSelectControls(item, maze);
          } else {
            hideSelectControls();
          }
        }
      }
    }
  };

  function hideSelectControls() {
    selectControls.forEach((control) => {
      control.setAttribute("hidden", true);
    });
  }

  function showDescription(item) {
    descrArea.innerHTML = `gem: ${item.name} <br>
    range: ${item.range} <br>
    damage: ${item.damage}<br>
    Ability: ${item.ability}`;
  }

  function showSelectControls(item) {
    selectBtn.removeAttribute("hidden");
    selectBtn.addEventListener("click", selectGem);
    selectBtn.item = item;
    if (item.gemRank > 1) {
      downgradeBtn.removeAttribute("hidden");
      downgradeBtn.addEventListener("click", downgradeGem);
      downgradeBtn.item = item;
    }
    const duplicate = isDuplicated(item);
    if (duplicate == 4) {
      combineBtn.removeAttribute("hidden");
      combineBtn.addEventListener("click", combineGem);
      combineBtn.item = item;
      combineDoubleBtn.removeAttribute("hidden");
      combineDoubleBtn.addEventListener("click", combineDoubleGem);
      combineDoubleBtn.item = item;
    } else if (duplicate >= 2) {
      combineBtn.removeAttribute("hidden");
      combineBtn.addEventListener("click", combineGem);
      combineBtn.item = item;
    }
  }

  const selectGem = function (e) {
    for (const gems in maze) {
      if (Object.hasOwnProperty.call(maze, gems)) {
        const gem = maze[gems];
        if (gem.new && gem != e.currentTarget.item) {
          gem.type = "rock";
          gem.rank = "";
          gem.set(atlas.rock);
        }
      }
    }

    e.currentTarget.item.new = false;
    hideSelectControls();
    attackPhase();
  };

  const downgradeGem = function (e) {
    const item = e.currentTarget.item;
    const newRank = ranks.indexOf(item.rank[0]) - 1;
    item.rank = ranks[newRank];
    item.set(atlas.gems[item.type][item.rank]);
    selectGem(e);
  };

  function isDuplicated(item) {
    let cnt = 0;
    maze.forEach((gem) => {
      if (
        gem.new &&
        gem.rank[0] == item.rank[0] &&
        gem.type[0] == item.type[0]
      ) {
        cnt++;
      }
    });

    return cnt;
  }

  const combineGem = function (e) {
    const item = e.currentTarget.item;
    const newRank = ranks.indexOf(item.rank[0]) + 1;
    item.rank = ranks[newRank];
    item.set(atlas.gems[item.type][item.rank]);
    console.log(item.image);
    selectGem(e);
  };

  const combineDoubleGem = function (e) {
    const item = e.currentTarget.item;
    const newRank = ranks.indexOf(item.rank[0]) + 2;
    item.rank = ranks[newRank];
    item.set(atlas.gems[item.type][item.rank]);
    selectGem(e);
  };

  function attackPhase() {
    phase = 1;
    if (createEnemies()) {
      // let i = 0;
      // let id = setTimeout(function addEnemy() {
      //   game.stage.add(enemies[i]);
      //   console.log(i);
      //   i++;
      //   id = setTimeout(addEnemy, 1500);
      //   if (i == enemies.length) {
      //     console.log("конец");
      //     clearTimeout(id);
      //   }
      // }, 1000);

      addEnemy()
      paths = createPath();
    }

    // fireBullet();
  }
  let enemyNumber = 0
  function addEnemy() {
    if (enemyNumber >= 10) return
    // console.log('new Enemy');
    game.stage.add(enemies[enemyNumber])
    enemyNumber++

    setTimeout(() => {
      addEnemy()
    }, 1000)
  }

  function createEnemies() {
    for (let i = 0; i < 10; i++) {
      const newEnemy = new Enemy({
        name: atlas.enemies[roundLevel - 1].name,
        image: images,
        frame: {
          x: atlas.enemies[roundLevel - 1].x,
          y: atlas.enemies[roundLevel - 1].y,
          width: 20,
          height: 20,
        },
        x: waypoints[0].x * scale,
        y: waypoints[0].y * scale,
        width: scale,
        height: scale,
        hp: atlas.enemies[roundLevel - 1].hp,
        moveSpeed: atlas.enemies[roundLevel - 1].moveSpeed,
        armor: atlas.enemies[roundLevel - 1].armor,
        flying: atlas.enemies[roundLevel - 1].flying,
        visible: false,
        // delay: (i + 1) * 1000,
      });
      enemies.push(newEnemy);
    }
    return true;
  }

  function createPath() {
    let paths = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
      let gridBackup = grid.clone();
      let path = finder.findPath(
        waypoints[i].x,
        waypoints[i].y,
        waypoints[i + 1].x,
        waypoints[i + 1].y,
        gridBackup
      );
      paths.push(path);
    }

    return paths;
  }

  function roadmap(paths) {
    let pathN = [];
    for (let i = 0; i < enemies.length; i++) {
      pathN[i] = 0;
    }
    for (let i = 0; i < enemies.length; i++) {
      for (let j = 0; j < paths[pathN[i]].length; j++) {
        if (
          enemies[i].x == paths[pathN[i]][j][0] * scale &&
          enemies[i].y == paths[pathN[i]][j][1] * scale
        ) {
          if (j == paths[pathN[i]].length - 1) {
            if (pathN[i] == 5) {
              deleteEnemy(enemies[i]);
              return;
            }
            pathN[i]++;
            enemies[i].speedX =
              (paths[pathN[i]][1][0] - paths[pathN[i]][0][0]) * tempSpeed;
            enemies[i].speedY =
              (paths[pathN[i]][1][1] - paths[pathN[i]][0][1]) * tempSpeed;
          } else {
            enemies[i].speedX =
              (paths[pathN[i]][j + 1][0] - paths[pathN[i]][j][0]) * tempSpeed;
            enemies[i].speedY =
              (paths[pathN[i]][j + 1][1] - paths[pathN[i]][j][1]) * tempSpeed;
          }
        }
      }
    }
  }


  game.update = () => {
    let pathN = [];
    for (let i = 0; i < enemies.length; i++) {
      pathN[i] = 0;
    }
    if (phase) {
      // enemies.forEach((enemy) => {
      //   if (enemy.isNext) {
      //     console.log(enemy);
      //   }
      // });

      // const paths = createPath();
      // roadmap(paths);

      for (let i = 0; i < enemies.length; i++) {
        for (let j = 0; j < paths[pathN[i]].length; j++) {
          if (
            enemies[i].x == paths[pathN[i]][j][0] * scale &&
            enemies[i].y == paths[pathN[i]][j][1] * scale
          ) {
            if (j == paths[pathN[i]].length - 1) {
              if (pathN[i] == 5) {
                deleteEnemy(enemies[i]);
                return;
              }
              pathN[i]++;
              enemies[i].speedX =
                (paths[pathN[i]][1][0] - paths[pathN[i]][0][0]) * tempSpeed;
              enemies[i].speedY =
                (paths[pathN[i]][1][1] - paths[pathN[i]][0][1]) * tempSpeed;
            } else {
              enemies[i].speedX =
                (paths[pathN[i]][j + 1][0] - paths[pathN[i]][j][0]) * tempSpeed;
              enemies[i].speedY =
                (paths[pathN[i]][j + 1][1] - paths[pathN[i]][j][1]) * tempSpeed;
            }
          }
        }
      }

      maze.forEach((item) => {
        if (item.type != "rock") {
          // if (item.fireStatus) console.log("fire");
        }
      });
    }
  };

  // let targets = [];

  // function fireBullet() {
  //   for (const items in maze) {
  //     if (Object.hasOwnProperty.call(maze, items)) {
  //       const item = maze[items];
  //       if (item.type != "rock") {
  //         item.inRadius = () => {
  //           game.ctx.beginPath();
  //           game.ctx.arc(
  //             (2 * item.x + item.width) / 2,
  //             (2 * item.y + item.height) / 2,
  //             item.range,
  //             0,
  //             2 * Math.PI
  //           );

  //           enemies.forEach((enemy) => {
  //             if (
  //               game.ctx.isPointInPath(enemy.x, enemy.y) ||
  //               game.ctx.isPointInPath(enemy.x, enemy.y + enemy.height) ||
  //               game.ctx.isPointInPath(enemy.x + enemy.width, enemy.y) ||
  //               game.ctx.isPointInPath(
  //                 enemy.x + enemy.width,
  //                 enemy.y + enemy.height
  //               )
  //             ) {
  //               if (!targets.includes(enemy)) {
  //                 targets.push(enemy);
  //               }
  //               let newBullet = attack(item, targets[0]);
  //               if (newBullet) {
  //                 game.hit = () => {
  //                   if (!newBullet.hit) {
  //                     if (haveCollision(newBullet, enemy)) {
  //                       game.stage.delete(newBullet);
  //                       newBullet.hit = true;
  //                       enemy.hp -= item.damage;
  //                       console.log(enemy.hp);
  //                       newBullet.speedX = 0;
  //                       newBullet.speedY = 0;
  //                       if (enemy.hp <= 0) {
  //                         deleteEnemy(enemy);
  //                         // game.hit = () => {};
  //                       }
  //                     }
  //                   }
  //                 };
  //               }
  //             } else {
  //               if (targets.includes(enemy))
  //                 targets.splice(targets.indexOf(enemy), 1);
  //             }
  //           });
  //         };
  //       }
  //     }
  //   }
  // }

  // function attack(tower, enemy) {
  //   if (tower.fireStatus) {
  //     const newBullet = new Bullet({
  //       image: images,
  //       frame: {
  //         x: atlas.bullet.x,
  //         y: atlas.bullet.y,
  //         width: scale,
  //         height: scale,
  //       },
  //       x: tower.x,
  //       y: tower.y,
  //       width: scale,
  //       height: scale,
  //       speedX:
  //         ((enemy.x - tower.x) /
  //           (Math.abs(enemy.x - tower.x) + Math.abs(enemy.y - tower.y))) *
  //         8,
  //       speedY:
  //         ((enemy.y - tower.y) /
  //           (Math.abs(enemy.x - tower.x) + Math.abs(enemy.y - tower.y))) *
  //         8,
  //       tower: tower,
  //     });
  //     game.stage.add(newBullet);
  //     return newBullet;
  //   }
  // }

  function deleteEnemy(enemy) {
    enemies.splice(enemies.indexOf(enemy), 1);
    game.stage.delete(enemy);
    console.log(enemies);
    if (enemies.length == 0) {
      roundLevel++;
      startRound();
    }
  }

  const removePhase = function () {
    game.canvas.addEventListener("click", removeRock);
  };

  const removeRock = function (e) {
    const pos = getPostion(e);
    for (const items in maze) {
      if (Object.hasOwnProperty.call(maze, items)) {
        const item = maze[items];
        if (item.x == pos.x && item.y == pos.y && item.type == "rock") {
          game.stage.delete(item);
          maze.splice(maze.indexOf(item), 1);
          grid.setWalkableAt(item.x / scale, item.y / scale, true);
          console.log(maze);
        }
      }
    }
    game.canvas.removeEventListener("click", removeRock);
  };

  startRound(roundLevel);
  game.canvas.addEventListener("click", selectItem);
}
