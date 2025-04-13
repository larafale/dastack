export const addClassname = (element: HTMLElement, classname: string) => {
  element.classList.add(classname);
};

export const removeClassname = (element: HTMLElement, classname: string) => {
  element.classList.remove(classname);
};

export const toggleClassname = (element: HTMLElement, classname: string) => {
  element.classList.toggle(classname);
};
