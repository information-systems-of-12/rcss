export default async components => {

  if ( components && components.length > 0 ){
    for ( const c of components ){

      if ( c && c.load ){
        await c.load()
      }
      
    }
  }

}