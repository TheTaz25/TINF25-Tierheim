import { removeClass, addClass, setInnerText, setValue } from "./dom.js";

function rollTheDice(threshold: number) {
  return Math.random() <= threshold;
}

type StatName = "health" | "energy" | "hunger" | "trust";

type Translations = Record<StatName, Record<"low" | "medium" | "high", string>>;

/*
{
  low: string;
  medium: string;
  high: string;
}
*/

const animalBuilder = () => {
  const stats = {
    health: 100,
    energy: 85,
    hunger: 50,
    trust: 20,
  };

  const inventory = new Set();
  let translation: Translations;
  let shelterLoop = 3;
  let dayCounter = 1;

  // 'health' || 'energy' || 'hunger' || 'trust'
  const updateUi = (statName: StatName) => {
    setValue(`#debug-${statName}`, stats[statName]);

    const key =
      stats[statName] > 65 ? "high" : stats[statName] > 32 ? "medium" : "low";

    setInnerText(`#${statName}`, translation?.[statName]?.[key]);
  };

  function setHealth(value: number, asDelta = true) {
    if (asDelta) {
      stats.health = stats.health + value;
    } else {
      stats.health = value;
    }
    // clamp health
    stats.health = Math.min(Math.max(stats.health, 0), 100);

    // game-over screen
    if (stats.health < 1) {
      nextScreen(15);
      throw new Error("Player Died");
    }
    updateUi("health");
  }

  function setEnergy(value: number, asDelta = true) {
    if (asDelta) {
      stats.energy = stats.energy + value;
    } else {
      stats.energy = value;
    }
    updateUi("energy");
  }

  function setHunger(value: number, asDelta = true) {
    if (asDelta) {
      stats.hunger = stats.hunger + value;
    } else {
      stats.hunger = value;
    }
    updateUi("hunger");
  }

  function setTrust(value: number, asDelta = true) {
    if (asDelta) {
      stats.trust = stats.trust + value;
    } else {
      stats.trust = value;
    }
    updateUi("trust");
  }

  function triggerScreen8Event() {
    const result = Math.random();
    addClass("#option-1", "hidden");
    addClass("#option-2", "hidden");
    addClass("#option-3", "hidden");
    if (result < 0.34) {
      removeClass("#option-1", "hidden");
      setEnergy(-10);
      setHealth(-5);
    } else if (result < 0.67) {
      removeClass("#option-2", "hidden");
      inventory.add("Decke");
      setEnergy(10);
    } else {
      removeClass("#option-3", "hidden");
      setTrust(5);
    }

    if (stats.hunger > 80) setHealth(-10);
  }

  function reloopShelter() {
    shelterLoop--;
    if (shelterLoop === 0) {
      nextScreen(15);
    }
  }

  function newDay() {
    dayCounter++;

    if (dayCounter < 3) {
      if (stats.trust < 40 && stats.energy > 50) {
        nextScreen(13);
        return;
      }
    }

    if (stats.hunger > 100) {
      nextScreen(15);
      return;
    }

    nextScreen(3);
  }

  function handleGameInput(actionId: string) {
    switch (actionId) {
      case "s1-a1":
        setHunger(-15);
        setEnergy(-10);
        if (rollTheDice(0.2)) {
          setHealth(-5);
        }
        rollTheDice(0.3) && inventory.add("Alter Knochen");
        nextScreen(2);
        break;
      case "s1-a2":
        setHunger(-5);
        nextScreen(2);
        break;
      case "s1-a3":
        setEnergy(15);
        setHunger(10);
        break;
      // SCREEN 2
      case "s2-a1":
        if (stats.energy > 20) {
          setHunger(-30);
          setEnergy(-15);
          if (rollTheDice(0.3)) {
            nextScreen(9);
          } else {
            nextScreen(3);
          }
        }
        break;
      case "s2-a2":
        setHunger(-10);
        setEnergy(5);
        nextScreen(3);
        break;
      case "s2-a3":
        setTrust(-10);
        nextScreen(9);
        break;
      // SCREEN 3
      case "s3-a1":
        if (stats.trust > 40) {
          setTrust(10);
          setHunger(-5);
          if (rollTheDice(0.25)) inventory.add("Rotes Halsband");
        } else {
          setTrust(5);
          setEnergy(-5);
        }
        nextScreen(4);
        break;
      case "s3-a2":
        if (rollTheDice(0.5)) {
          setEnergy(-10);
          setHealth(-10);
        } else {
          inventory.add("Stöckchen");
          setTrust(5);
        }
        nextScreen(4);
        break;
      case "s3-a3":
        setEnergy(20);
        setHunger(10);
        nextScreen(4);
        break;
      // SCREEN 4
      case "s4-a1":
        if (stats.energy > 30) {
          setHunger(-25);
          setEnergy(-15);
          rollTheDice(0.4) ? nextScreen(9) : nextScreen(5);
        }
        break;
      case "s4-a2":
        setTrust(10);
        setHunger(-5);
        nextScreen(5);
        break;
      case "s4-a3":
        nextScreen(10);
        break;
      // SCREEN 5
      case "s5-a1":
        setHealth(5);
        setEnergy(-5);
        nextScreen(6);
        break;
      case "s5-a2":
        setHealth(-5);
        nextScreen(6);
        break;
      case "s5-a3":
        if (inventory.has("Bandage")) {
          inventory.delete("Bandage");
          setHealth(20);
          nextScreen(6);
        }
        break;
      // SCREEN 6
      case "s6-a1":
        setTrust(15);
        setHunger(-5);
        if (inventory.has("Rotes Halsband")) {
          setTrust(10);
        }
        nextScreen(7);
        break;
      case "s6-a2":
        setTrust(5);
        nextScreen(7);
        break;
      case "s6-a3":
        setTrust(-20);
        nextScreen(7);
        break;
      // SCREEN 7
      case "s7-a1":
        setEnergy(20);
        setHunger(10);
        nextScreen(8);
        triggerScreen8Event();
        break;
      case "s7-a2":
        setEnergy(15);
        rollTheDice(0.3) && setHealth(-10);
        nextScreen(8);
        triggerScreen8Event();
        break;
      case "s7-a3":
        if (stats.trust > 60) {
          nextScreen(14);
        }
        break;
      // SCREEN 8
      case "s8-a1":
        newDay();
        break;
      // SCREEN 9
      case "s9-a1":
        if (stats.energy > 40) {
          newDay();
        } else {
          nextScreen(12);
        }
        break;
      case "s9-a2":
        rollTheDice(0.5) ? newDay() : nextScreen(12);
        break;
      case "s9-a3":
        setTrust(5);
        nextScreen(12);
        break;
      // SCREEN 10
      case "s10-a1":
        setHunger(-20);
        setEnergy(-15);
        rollTheDice(0.3) && setHealth(-10);
        nextScreen(11);
        break;
      case "s10-a2":
        nextScreen(11);
        break;
      case "s10-a3":
        newDay();
        break;
      // SCREEN 11
      case "s11-a1":
        rollTheDice(0.5) && inventory.add("Fleisch");
        rollTheDice(0.5) && setHealth(-15);
        nextScreen(7);
        break;
      case "s11-a2":
        setEnergy(-10);
        nextScreen(7);
        break;
      // SCREEN 12
      case "s12-a1":
        setTrust(10);
        stats.trust > 70 ? nextScreen(14) : reloopShelter();
        break;
      case "s12-a2":
        setTrust(-10);
        reloopShelter();
        break;
      case "s12-a3":
        setEnergy(10);
        reloopShelter();
        break;
    }
    // Check winning conditions
  }

  async function loadTranslations() {
    const url = "/assets/translations.json";

    const response = await fetch(url);

    translation = await response.json();
  }

  loadTranslations();

  return {
    setHealth,
    setEnergy,
    setHunger,
    setTrust,
    handleGameInput,
  };
};

const dog = animalBuilder();

window.dog = dog;

declare global {
  interface Window {
    dog: ReturnType<typeof animalBuilder>;
  }
}

// BUTTONS

function enableButtons() {
  const allButtons = document.querySelectorAll("button");

  allButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (event.target) {
        const target = event.target as HTMLElement;
        dog.handleGameInput(target.id);
      }
    });
  });
}
enableButtons();

// SCREEN

function hideCurrentScreen() {
  addClass(".screen:not(.hidden)", "hidden");
}

function showScreen(screenNumber: number) {
  removeClass(`#screen-${screenNumber}`, "hidden");
}

function nextScreen(screenNumber: number) {
  hideCurrentScreen();
  showScreen(screenNumber);
}

function connectDebugScreen() {
  const input = document.getElementById("debug-screen");

  if (input) {
    input.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      const targetScreen = parseInt(target.value, 10);

      nextScreen(targetScreen);
    });
  }
}
connectDebugScreen();

// DEBUG

function connectDebugToStat(statName: StatName) {
  const input = document.getElementById(`debug-${statName}`);

  // const setter = {
  //   health: dog.setHealth,
  //   hunger: dog.setHunger,
  //   energy: dog.setEnergy,
  //   trust: dog.setTrust,
  // };

  if (input) {
    input.addEventListener("change", (event) => {
      // .value ist immer ein String innerhalb eines inputs!
      const parsedValue = parseInt(
        (event.target as HTMLInputElement).value,
        10,
      );
      // setter[statName](parsedValue);
      switch (statName) {
        case "health":
          dog.setHealth(parsedValue, false);
          break;
        case "energy":
          dog.setEnergy(parsedValue, false);
          break;
        case "hunger":
          dog.setHunger(parsedValue, false);
          break;
        case "trust":
          dog.setTrust(parsedValue, false);
          break;
      }
    });
  } else {
    console.warn(`Debug input for stat ${statName} not found!`);
  }
}

connectDebugToStat("health");
connectDebugToStat("energy");
connectDebugToStat("hunger");
connectDebugToStat("trust");
