function rollTheDice (threshold) {
  return Math.random() <= threshold;
}

const animalBuilder = () => {
  const stats = {
    health: 100,
    energy: 85,
    hunger: 50,
    trust: 20,
  };

  const inventory = [];
  let translation;

  // 'health' || 'energy' || 'hunger' || 'trust'
  const updateUi = (statName) => {
    const debugInput = document.getElementById(`debug-${statName}`);
    if (debugInput) {
      debugInput.value = stats[statName];
    }

    const label = document.getElementById(statName);
    if (label) {
      const key = stats[statName] > 65
        ? 'high' : stats[statName] > 32
          ? 'medium' : 'low';
      label.innerText = translation[statName][key];
    }
  };

  function setHealth (value, asDelta) {
    if (asDelta) {
      stats.health = stats.health + value;
    } else {
      stats.health = value
    }
    updateUi('health');
  }

  function getHealth () {
    return stats.health;
  }

  function setEnergy (value, asDelta) {
    if (asDelta) {
      stats.energy = stats.energy + value;
    } else {
      stats.energy = value
    }
    updateUi('energy');
  }

  function getEnergy () {
    return stats.energy;
  }

  function setHunger (value, asDelta) {
    if (asDelta) {
      stats.hunger = stats.hunger + value;
    } else {
      stats.hunger = value
    }
    updateUi('hunger');
  }

  function getHunger () {
    return stats.hunger;
  }

  function setTrust (value, asDelta) {
    if (asDelta) {
      stats.trust = stats.trust + value;
    } else {
      stats.trust = value
    }
    updateUi('trust');
  }

  function getTrust () {
    return stats.trust;
  }

  function handleGameInput(actionId) {
    switch (actionId) {
      case 's1-a1':
        setHunger(-15, true);
        setEnergy(-10, true);
        if (rollTheDice(0.2)) {
          setHealth(-5, true);
        }
        rollTheDice(0.3) && (inventory.push('Alter Knochen'));
        nextScreen(2);
        break;
    }
  }

  async function loadTranslations() {
    const url = '/assets/translations.json';

    const response = await fetch(url);

    translation = await response.json();
  }

  loadTranslations();

  return {
    getHealth,
    setHealth,
    setEnergy,
    getEnergy,
    setHunger,
    getHunger,
    setTrust,
    getTrust,
    handleGameInput,
  };
};

const dog = animalBuilder();

window.dog = dog;

// BUTTONS

function enableButtons() {
  const allButtons = document.querySelectorAll('button');

  allButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      dog.handleGameInput(event.target.id);
    })
  })
}
enableButtons();

// SCREEN

function hideCurrentScreen () {
  const currentScreen = document.querySelector('.screen:not(.hidden)');

  if (currentScreen) {
    currentScreen.classList.add('hidden');
  }
}

function showScreen (screenNumber) {
  const nextScreen = document.getElementById(`screen-${screenNumber}`);

  if (nextScreen) {
    nextScreen.classList.remove('hidden');
  }
}

function nextScreen (screenNumber) {
  hideCurrentScreen();
  showScreen(screenNumber);
}

function connectDebugScreen () {
  const input = document.getElementById('debug-screen');

  if (input) {
    input.addEventListener('change', (event) => {
      const targetScreen = parseInt(event.target.value);

      nextScreen(targetScreen);
    })
  }
}
connectDebugScreen();

// DEBUG

function connectDebugToStat(statName) {
  const input = document.getElementById(`debug-${statName}`);

  // const setter = {
  //   health: dog.setHealth,
  //   hunger: dog.setHunger,
  //   energy: dog.setEnergy,
  //   trust: dog.setTrust,
  // };

  if (input) {
    input.addEventListener('change', (event) => {
      // .value ist immer ein String innerhalb eines inputs!
      const parsedValue = parseInt(event.target.value);
      // setter[statName](parsedValue);
      switch (statName) {
        case 'health':
          dog.setHealth(parsedValue);
          break;
        case 'energy':
          dog.setEnergy(parsedValue);
          break;
        case 'hunger':
          dog.setHunger(parsedValue);
          break;
        case 'trust':
          dog.setTrust(parsedValue);
          break;
      }
    });
  } else {
    console.warn(`Debug input for stat ${statName} not found!`);
  }
}

connectDebugToStat('health');
connectDebugToStat('energy');
connectDebugToStat('hunger');
connectDebugToStat('trust');
