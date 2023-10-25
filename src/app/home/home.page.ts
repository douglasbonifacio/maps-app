import { Component, ElementRef, ViewChild } from '@angular/core';

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

  constructor() {}

  async exibirMapa(){

    // The location of Uluru
  const position = { lat: -22.463255, lng:  -48.562072 };

  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement} = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  // The map, centered at Uluru
  this.map = new Map(
    this.mapRef.nativeElement,
    {
      zoom: 4,
      center: position,
      mapId: 'DEMO_MAP_ID',
    }
  );

  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: this.map,
    position: position,
    title: 'Uluru'
  });
  }

  ionViewWillEnter(){
    this.exibirMapa();
  }

}
