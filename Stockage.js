
// Private variables
let _state = {},
  _options = {},
  _subscribers = [],
  _context;

// Storage Class
export default class Storage {

  constructor( params ){

    // Init options
    _options = Object.assign( {
      storage : null
    }, params.options );

    // Init State
    _state = Object.assign( params.state || {},
      _options.storage ?
        JSON.parse( localStorage.getItem( _options.storage ) )
        : {} );

    // Init Context
    _context = this;

  }

  getState(){ return state(); }

  subscribe( subscriber , method ){

    // Set a Subscriber Id
    if( subscriber && !subscriber.__storage__subscriber__id ){
      subscriber.__storage__subscriber__id = Guid();
    }

    // Push the Subscriber to the Array
    _subscribers.push( { subscriber, method } );

    // Return the state
    return state();

  }

  unsubscribe( subscriber ){

    // Reduce the Array to remove the subscriber
    _subscribers = _subscribers.reduce( ( subscribers, current ) => {
      if( current.subscriber.__storage__subscriber__id !== subscriber.__storage__subscriber__id ){
        subscribers.push( current );
      }
      return subscribers;
    }, [] );

  }

  action( name ){

    return function(){

      let method = _context[ name ];

      // Return an error if the method is not an existing function

      if( !method ){
        return console.error( "The Storage method '" + name + "' is not defined" );
      }

      if( typeof method !== 'function' ){
        return console.error( "The Storage method '" + name + "' is not a function" );
      }

      // I get arguments array
      let args = [].splice.call( arguments, 0 );

      // Assync is a method i give to context to achieve async state change in action
      let async = ( callback ) => {
        let res = callback.apply( null , [ state() ] );
        if( res ){
          _state = res;
          _context.applyChange();
        }
      }

      // Apply the async function to the "method" context and pass state and args
      let res = method.apply( { async } , [ state() ].concat( args ) );

      // If there is a return statement, we apply the change to the state
      if ( res ){
        _state = res;
        _context.applyChange();
      }
    }

  }

  applyChange(){

    // Notify all subscribers that state has change
    _subscribers.forEach( ( subscriber, i ) => {
      subscriber.method.call( subscriber.subscriber, state())
    } );

    // If options storage is named, we save in localStorage
    if( _options.storage ){
      localStorage.setItem( _options.storage, JSON.stringify( state() ) );
    }

  }

}

// Private methods

function state(){
  return Object.assign( {} , _state );
}

function Guid() {
  function s4() {
    return Math.floor( ( 1 + Math.random() ) * 0x10000 )
      .toString( 16 )
      .substring( 1 );
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
