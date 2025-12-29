import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { About } from '../../components/about/about';
import { Services } from '../../components/services/services';
import { Contact } from '../../components/contact/contact';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Services, Contact],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
