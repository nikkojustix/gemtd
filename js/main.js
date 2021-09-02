import Game from "./Game.js";
import { loadImage, loadJSON } from "./Loader.js";
import Sprite from "./Sprite.js";
import DisplayObject from "./DisplayObject.js";

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

  const tempSpeed = 1;

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
    game.canvas.addEventListener("click", buildGem);
  };

  const buildGem = function (e) {
    const pos = getPostion(e);
    if (buildingBlocked(pos)) return;
    getRandomGem(pos);

    if (gemCounter == 5) {
      buildBtn.removeEventListener("click", buildPhase);
      gemCounter = 0;
    }
    gemCounter++;
    game.canvas.removeEventListener("click", buildGem);
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
    console.log("randRank: ", randRank);

    const randomGem = new Sprite({
      image: images,
      frame: {
        x: atlas.gems[randGem][randRank].x,
        y: atlas.gems[randGem][randRank].y,
        width: 20,
        height: 20,
      },
      x: pos.x,
      y: pos.y,
      range: atlas.gems[randGem][randRank].range * scale,
      gemType: randGem,
      gemRank: randRank,
      damage: atlas.gems[randGem][randRank].damage,
      ability: atlas.gems[randGem][randRank].ability,
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
          console.log(item.image);
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
    descrArea.innerHTML = `gem: ${item.gemRank} ${item.gemType} <br>
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
          gem.gemType = "rock";
          gem.gemRank = "";
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
    const newRank = ranks.indexOf(item.gemRank[0]) - 1;
    item.gemRank = ranks[newRank];
    item.set(atlas.gems[item.gemType][item.gemRank]);
    selectGem(e);
  };

  function isDuplicated(item) {
    let cnt = 0;
    maze.forEach((gem) => {
      if (
        gem.new &&
        gem.gemRank[0] == item.gemRank[0] &&
        gem.gemType[0] == item.gemType[0]
      ) {
        cnt++;
      }
    });

    return cnt;
  }

  const combineGem = function (e) {
    const item = e.currentTarget.item;
    const newRank = ranks.indexOf(item.gemRank[0]) + 1;
    item.gemRank = ranks[newRank];
    item.set(atlas.gems[item.gemType][item.gemRank]);
    console.log(item.image);
    selectGem(e);
  };

  const combineDoubleGem = function (e) {
    const item = e.currentTarget.item;
    const newRank = ranks.indexOf(item.gemRank[0]) + 2;
    item.gemRank = ranks[newRank];
    item.set(atlas.gems[item.gemType][item.gemRank]);
    selectGem(e);
  };

  function attackPhase() {
    if (createEnemies()) {
      let i = 0;
      let id = setTimeout(function addEnemy() {
        game.stage.add(enemies[i]);
        i++;
        id = setTimeout(addEnemy, 1500);
        if (i == enemies.length) {
          console.log("конец");
          clearTimeout(id);
        }
      }, 1500);

      const paths = createPath();
      console.log(paths);
      roadmap(paths);
    }
  }

  function createEnemies() {
    for (let i = 0; i < 10; i++) {
      const newEnemy = new Sprite({
        image: images,
        frame: {
          x: atlas.enemies.x,
          y: atlas.enemies.y,
          width: 20,
          height: 20,
        },
        x: waypoints[0].x * scale,
        y: waypoints[0].y * scale,
        width: waypoints[0].width * scale,
        height: waypoints[0].height * scale,
        // speedY: tempSpeed,
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
    game.update = () => {
      for (let i = 0; i < enemies.length; i++) {
        for (let j = 0; j < paths[pathN[i]].length; j++) {
          if (
            enemies[i].x == paths[pathN[i]][j][0] * scale &&
            enemies[i].y == paths[pathN[i]][j][1] * scale
          ) {
            if (j == paths[pathN[i]].length - 1) {
              if (pathN[i] == 5) {
                console.log(enemies[i]);
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
    };
  }

  function deleteEnemy(enemy) {
    enemies.splice(enemies.indexOf(enemy), 1);
    game.stage.delete(enemy);
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
        if (item.x == pos.x && item.y == pos.y && item.gemType == "rock") {
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
