# stockage
***Stockage*** is a small class that help you to create a "data store".

## The API
### action
The method ***action*** return a function.
```javascript
let anActionNameMethod = YourStock.action('anActionName');
```
### getState
The method ***getState*** return a copy of the stockage state.

```javascript
let state = YourStock.getState();
```
### subscribe
The method ***subscribe*** return a copy of the stockage state and give you the hability to run a function each time the state change.

```javascript
YourStock.subscribe(anObject,aMethod);
```

### unsubscribe
The method ***unsubscribe*** doesn't return anything.

```javascript
YourStock.unsubscribe(anObject);
```

## Define a Stockage
This is an example of how do we define a ***stockage***.

This ***Stockage*** will be use in a ***React*** App.
```javascript
// AppStock.js
import Stockage from 'stockage';

class AppStock extends Stockage{

  constructor(){
    super({
      state : {
        text : ''
      },
      options : {
        storage : 'AppStock'
      }
    });
  }

  onTextInputChange(state,event){
    state.text = event.target.value;
    return state;
  }

}

let appStock = new AppStock();
export default appStock;
```
## Link it to a react component
This is how we ***link*** the state of a ***React*** component with the state of a ***Stockage***.
```javascript
import React from 'react';
import AppStock from './AppStock';

class App extends React.Component{

  constructor(props){
    super(props);
    this.state = AppStock.subscribe(this,this.setState);
  }

  componentWillUnmount(){
    AppStock.unsubscribe(this);
  }

  render(){
    return (<div>
      <input value={this.state.text}
             onChange={AppStock.action('onTextInputChange')} />
      {this.state.text}
    </div>)
  }

}

let appStock = new AppStock();
export default appStock;
```
