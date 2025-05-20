import { Component } from '@angular/core';
import { IonText, IonCol, IonGrid,IonRow, IonCardTitle, IonCardHeader, IonCard, IonCardContent, IonIcon, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonLabel, IonItem, IonInput } from '@ionic/angular/standalone';
import { FormsModule, isFormControl } from '@angular/forms';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation'
import { NgIf, NgIfContext } from '@angular/common';
import { Firestore, collection, addDoc, collectionData, query, orderBy } from '@angular/fire/firestore';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [FormsModule, IonCard, IonCardContent,
    IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel,
    IonButton, IonHeader, IonToolbar, IonTitle,
    IonContent, NgIf, IonIcon, IonCol, IonRow, IonGrid, IonText, IonList],
})

export class HomePage {
  latitude: number | null = null;
  longitude: number | null = null;
  nombre: string = 'Mateo Torres';
  createAt: number = Date.now();
  ubicacion: string = '';
  ubicacionPrecisa: boolean = false;

  constructor(private firestore: Firestore) { }

  async obtenerUbicacion() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
      this.ubicacion = `https://www.google.com/maps/search/?api=1&query=${this.latitude},${this.longitude}`;

    } catch (error) {
      console.error('Error obteniendo ubicacion', error);
    }
  }

  async abrirGoogleMaps() {
    await this.obtenerUbicacion();
    if (this.latitude && this.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${this.latitude},${this.longitude}`;
      window.open(url, '_blank');
    }
  }

  async guardarUbicacion() {
    await this.obtenerUbicacion();
    if (this.latitude && this.longitude) {
      const ubicacionRef = collection(this.firestore, 'ubicaciones');
      await addDoc(ubicacionRef, {
        nombre: this.nombre,
        latitude: this.latitude,
        longitude: this.longitude,
        createAt: this.createAt,
        ubicacion: this.ubicacion
      });
    }
    alert('Ubicación guardada');
  }
}
