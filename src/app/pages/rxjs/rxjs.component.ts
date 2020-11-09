import { Component } from '@angular/core';
import { Observable,interval } from 'rxjs';
import {retry,take,map} from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent  {

  constructor() { 
    

   /*  this.retornaObservable().pipe(
      retry(2)
    )
    .subscribe(
      valor=>console.log('Subs:',valor),
      error=>console.warn('Error:',error),
      ()=>console.info('Obs terminado')
    ); */

    this.retornaIntervalo()
        .subscribe(
       //   (valor)=>console.log(valor)
       console.log
        )


  }
  retornaIntervalo():Observable<number>{
    return interval(1000)
                      .pipe(take(4),
                        map(valor=>valor + 1
                          //{
                          //return valor+1;
                          //return 'Hola montavacas'+valor;
                        //}
                        )
                       );
    
  }

  retornaObservable():Observable<number>{

    let i = -1;

    return new Observable<number>(observer=>{
    

       const intervalo = setInterval(()=>{
       //console.log('tick');
           i++;
           observer.next(i);
           if(i === 4){
            clearInterval(intervalo);
            observer.complete();
           }
           if(i===2){            
            //console.log('i=2....error');
             observer.error('i llego al valor de 2');
           }
      },1000)
         
    });

  
    

  }



}
