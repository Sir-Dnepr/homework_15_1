"use strict";

const form = document.querySelector('.form.js--form');
const NEW_TASK_INPUT_TEXT_NAME = 'value';
const STORAGE_TASKS_LIST_NAME = 'todo-list';
const COMPLETED_TASK_ITEM_CLASS = 'todo-item--checked';
const taskListElement = document.querySelector('.js--todos-wrapper');
let storageItems = [];

const getDataFromFormTarget = (target) => {
   let taskText = null;
   if (target) {
      const formData = new FormData(target);
      target.reset();
      const inputTextValue = formData.get(NEW_TASK_INPUT_TEXT_NAME);
      taskText = inputTextValue?.trim();
   }

   if (!taskText) {
      alert('Поле не може бути порожнім');
      return null;
   }

   return taskText;
};

const renderItemInList = (item) => {
   const listItem = document.createElement('li');
   listItem.classList.add('todo-item');
   item.is_completed
       ? listItem.classList.add(COMPLETED_TASK_ITEM_CLASS)
       : listItem.classList.remove(COMPLETED_TASK_ITEM_CLASS);
   listItem.id = item.id;

   const checkbox = document.createElement('input');
   checkbox.type = 'checkbox';
   checkbox.checked = item.is_completed;

   const descriptionSpan = document.createElement('span');
   descriptionSpan.classList.add('todo-item__description');
   descriptionSpan.textContent = item.text;

   const deleteButton = document.createElement('button');
   deleteButton.classList.add('todo-item__delete');
   deleteButton.textContent = 'Видалити';

   listItem.append(checkbox);
   listItem.append(descriptionSpan);
   listItem.append(deleteButton);

   taskListElement.prepend(listItem);
}

const addStorageItem = (taskText, isCompleted) => {
   const uniqueId = Math.floor(Date.now()) + Math.floor(Math.random() * (1000 - 9999 + 1)) + 1000;
   const newItem = {
      'id': uniqueId,
      'text': taskText,
      'is_completed': isCompleted
   };

   addStorageItems(newItem, uniqueId);

   return newItem;
}

const deleteStorageItem = (id) => {
   const items = getStorageItems();

   const currentTaskIndex = getStorageItemIndexByTaskId(id);
   if (currentTaskIndex !== null) {
      items.splice(currentTaskIndex, 1);
      localStorage.setItem(STORAGE_TASKS_LIST_NAME, JSON.stringify(storageItems));
   }
}

const getStorageItemIndexByTaskId = (id) => {
   const items = getStorageItems();
   const currentTaskIndex = items.findIndex(item => +item.id === +id);

   return currentTaskIndex > -1 ? currentTaskIndex: null;
}

const getStorageItems = () => {
   if (storageItems.length === 0) {
      const compressedStorageItems = localStorage.getItem(STORAGE_TASKS_LIST_NAME);
      storageItems = compressedStorageItems ? JSON.parse(compressedStorageItems) : [];
   }

   return storageItems;
}

const addStorageItems = (item) => {
   const items = getStorageItems();
   items.push(item);
   localStorage.setItem(STORAGE_TASKS_LIST_NAME, JSON.stringify(items));

   return items;
}

form.addEventListener('submit', (event) => {
   event.preventDefault();

   const taskText = getDataFromFormTarget(event.target);
   if (taskText !== null) {
      const newItem = addStorageItem(taskText, false);
      renderItemInList(newItem);
   }
});

taskListElement.addEventListener('click', (event) => {
   const { target } = event;
   const liElement = target.closest('li');

   if (liElement.id) {
      if (target.nodeName === 'BUTTON') {
         if (liElement.id) {
            deleteStorageItem(liElement.id);
         }

         target.closest('li')?.remove();
      }

      if (target.nodeName === 'INPUT') {
         const currentTaskIndex = getStorageItemIndexByTaskId(liElement.id);

         if (currentTaskIndex !== null) {
            target.checked
               ? liElement.classList.add(COMPLETED_TASK_ITEM_CLASS)
               : liElement.classList.remove(COMPLETED_TASK_ITEM_CLASS);

            const items = getStorageItems();
            items[currentTaskIndex].is_completed = target.checked;
            localStorage.setItem(STORAGE_TASKS_LIST_NAME, JSON.stringify(items));
         }
      }
   }
});

const renderItemsInList = () => {
   const items = getStorageItems();
   items.forEach((item) => {
      renderItemInList(item);
   });
}

renderItemsInList();
