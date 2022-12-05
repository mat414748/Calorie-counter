import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// allows using html tags as functions in javascript
const { div, p, input, button, table, tr, td } = hh(h);

// A combination of Tailwind classes which represent a (more or less nice) button style
const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
const rowStyle = "min-w-[350px] border border-slate-300";
// Messages which can be used to update the model
const MSGS = {
  createRow: "createRow",
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  return div ({ }, [ 
    div({ className: "flex flex-row gap-4 items-center" }, [
    p({className: "text-2xl" }, `Name:`),
    input({type:"text", className:"border-4 border-black", id:"nameInput"}),
    p({className: "text-2xl" }, `Callories:`),
    input({type:"number", className:"border-4 border-black", id:"caloryInput"}),
    button({ className: btnStyle, onclick: () => dispatch(MSGS.createRow) }, "Create" + model.currentName + model.currentPassword),
    ]), 
    table({ className: "relative mx-auto border-collapse mt-10", id:"table" }, [
      tr({ className: "" }, [
        td({ className: rowStyle }, "Meal"),
        td({ className: rowStyle }, "Calories")
      ]),
    ])
  ]);
}

// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
  switch (msg) {
    case MSGS.createRow:
      const table = document.getElementById("table");
      const row = table.insertRow(-1);
      const name = row.insertCell(-1);
      const calory = row.insertCell(-1);
      const deleteRow = row.insertCell(-1);
      const delButton = document.createElement("button");
      deleteRow.appendChild(delButton);

      name.className = rowStyle;
      calory.className = rowStyle;
      delButton.className = btnStyle + " ml-5";

      delButton.addEventListener("click", function(event) {
        const td = event.target.parentNode; 
        const tr = td.parentNode;
        tr.parentNode.removeChild(tr);
      });

      name.innerText = document.getElementById("nameInput").value;
      calory.innerText = document.getElementById("caloryInput").value;
      delButton.innerText = "Delete";
      return model;
    default:
      return model;
  }
}

// The initial model when the app starts
const initModel = {
  currentName: "",
  currentPassword: ""
};

// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);