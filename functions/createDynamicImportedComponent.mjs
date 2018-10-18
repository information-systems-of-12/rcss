import * as React from 'react'
const Component = React.default.Component
const createElement = React.default.createElement

export default parameters => {

  const { loader, placeHolder } = parameters
  
  let WrappedComponent = null

  class DynamicImportedComponent extends Component {

    constructor( props ){
      super( props )
      this.state = {}
      this.state.WrappedComponent = WrappedComponent
      this.setWrappedComponent = this.setWrappedComponent.bind( this )

      DynamicImportedComponent.load().then( () => {
        this.setWrappedComponent()
      } )
      
    }

    render(){
      
      if ( this.state.WrappedComponent === null ){
        if ( placeHolder ){
          return createElement( placeHolder, { ...this.props } )
        } else {
          return null
        }
      }

      return createElement( this.state.WrappedComponent, { ...this.props } )
      
    }

    setWrappedComponent(){
      if ( JSON.stringify( this.state.WrappedComponent ) !== JSON.stringify( WrappedComponent ) ){
        this.setState( { WrappedComponent: WrappedComponent } )
      }  
    }

    static async load() {
      const ResolvedComponent = await loader()
      WrappedComponent = ResolvedComponent.default || ResolvedComponent


      const propertyNames = Object.getOwnPropertyNames( WrappedComponent )

      for ( const propertyName of propertyNames ){
        if ( propertyName !== 'length' && propertyName !== 'prototype' && propertyName !== 'name' ){
          DynamicImportedComponent[ propertyName ] = WrappedComponent[ propertyName ]
        }
      }

      for ( const key of Object.keys( WrappedComponent ) ){
        DynamicImportedComponent[ key ] = WrappedComponent[ key ]
      }
      
    }

  }

  DynamicImportedComponent.WrappedComponent = WrappedComponent

  return DynamicImportedComponent
  

}