export function loadHex(source: string, target: Uint8Array) {
  for( const line of source.split('\n') ) {
    if( line[0] === ':'  &&  line.substring(7,2) === '00') {
      const bytes = parseInt( line.substring(1,2), 16 );
      const addr =  parseInt( line.substring(3,4), 16 );
      for(let i = 0; i < bytes; i++) {
        target[addr+i] = parseInt(line.substring(9+2*i, 2), 16);
      }
    }
  }
}