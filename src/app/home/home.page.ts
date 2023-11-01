import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // Pega a div do html e coloca ela na variavel mapRef
  @ViewChild('map') mapRef!: ElementRef;

  //Cria uma variavel para o Maps
  map!: google.maps.Map;

  minhaPosicao!: google.maps.LatLng;

  listaEnderecos: google.maps.places.AutocompletePrediction[]=[]

  private autoComplete = new google.maps.places.AutocompleteService();
  private directions = new google.maps.DirectionsService();
  private directionsRender = new google.maps.DirectionsRenderer();

  constructor(private ngZone: NgZone) {}

  async exibirMapa(){

    // The location of Uluru
  const position = { lat: -22.463255, lng:  -48.562072 };

  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  
  // The map, centered at Uluru
  this.map = new Map(
    this.mapRef.nativeElement,
    {
      zoom: 4,
      center: position,
      mapId: 'DEMO_MAP_ID',
    }
  );

  /* The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: this.map,
    position: position,
    title: 'Uluru'
  });
  */
  this.buscarLocalizacao();
  }

  ionViewWillEnter(){
    this.exibirMapa();
  }

  async buscarLocalizacao(){
  const { AdvancedMarkerElement} = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;


  const coordinates = await Geolocation.getCurrentPosition({enableHighAccuracy: true});

  console.log('Current position:', coordinates);


  this.minhaPosicao = new google.maps.LatLng({
  lat: coordinates.coords.latitude, 
  lng: coordinates.coords.longitude
});
  this.map.setCenter
   

  this.map.setZoom(18);

  this.adicionaMarcador(this.minhaPosicao);

  }
  async adicionaMarcador(position: google.maps.LatLng){
    const { AdvancedMarkerElement} = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    const marker = new AdvancedMarkerElement({
      map: this.map,
      position: position,
     
      title: 'Marcador'
    });
  }
  
  //Busca endereços no Maps

    buscarEndereco(valorBusca: any){
      const busca = valorBusca.target.value as string;

      if(!busca.trim().length){
        this.listaEnderecos = [];
        return false; //Encerra a função

      }

      //Busca o endereço nio Maps.
      this.autoComplete.getPlacePredictions(
        {input:busca}, //Envia o valor da busca para o maps
        (arrayLocais, status) =>{
          if(status == 'OK'){ // Setiver retrorno da busca
          this.ngZone.run(()=>{ //Avisa ao HTML que te mmudança
          // Atribui o retorno a lista se ela possuir valores.
        this.listaEnderecos = arrayLocais ? arrayLocais :[];
      console.log(this.listaEnderecos);
    });
  } else{
    //Se deu erro na busca, limpa a lista.
    this.listaEnderecos = [];
  }
        }
      );
      return true;
    }

    tracaeRota(local: google.maps.places.AutocompletePrediction){
      this.listaEnderecos = []; // Limpa a lista d ebusca


      // Converte o texto do endereço para uma posição do GPS
      new google.maps.Geocoder().geocode({address: local.description}, resultado=>{
        this.adicionaMarcador(resultado![0].geometry.location); // Adicionar o marcador no local

        // Cria a configuração da rota
        const rota: google.maps.DirectionsRequest = {
          origin: this.minhaPosicao,
          destination: resultado![0].geometry.location,
          unitSystem: google.maps.UnitSystem.METRIC,
          travelMode: google.maps.TravelMode.DRIVING
        }

        // TRaça a rota entre os endereços.
        this.directions.route(rota,(resultado, status)=>{
          if(status == 'OK'){
            // Desennha a rota no mapa.
            this.directionsRender.setMap(this.map);
            this.directionsRender.setOptions({suppressMarkers: true});
            this.directionsRender.setDirections(resultado);
          }
        });
  });
    }

}
