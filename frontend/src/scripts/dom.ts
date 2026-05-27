export function setValue(target: string, value: string | number) {
  const input = document.querySelector<HTMLInputElement>(target);

  if (input) {
    input.value = value.toString();
  }
}

export function setInnerText(target: string, text: string) {
  const element = document.querySelector<HTMLBaseElement>(target);

  if (element) {
    element.innerText = text;
  }
}

export function addClass(target: string, newClass: string) {
  const element = document.querySelector(target);

  if (element) {
    element.classList.add(newClass);
  }
}

export function removeClass(target: string, classToRemove: string) {
  const element = document.querySelector(target);

  if (element) {
    element.classList.remove(classToRemove);
  }
}