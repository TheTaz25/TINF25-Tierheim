export function setValue(target, value) {
  const input = document.querySelector(target);

  if (input) {
    input.value = value;
  }
}

export function setInnerText(target, text) {
  const element = document.querySelector(target);

  if (element) {
    element.innerText = text;
  }
}

export function addClass(target, newClass) {
  const element = document.querySelector(target);

  if (element) {
    element.classList.add(newClass);
  }
}

export function removeClass(target, classToRemove) {
  const element = document.querySelector(target);

  if (element) {
    element.classList.remove(classToRemove);
  }
}