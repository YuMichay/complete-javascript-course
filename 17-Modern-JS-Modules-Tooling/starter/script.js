import cloneDeep from "lodash-es";
import "core-js/stable";
import "regenerator-runtime/runtime";

const state = {
    cart: [
        { product: "bread", quantity: 5 },
        { product: "pizza", quantity: 5 }
    ],
    user: { loggedIn: true }
};

const stateClone = cloneDeep(state);
console.log(stateClone);

if (module.hot) {
    module.hot.accept();
}