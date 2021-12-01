import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatToolbarModule} from "@angular/material/toolbar";
import { NavbarComponent } from './navbar/navbar.component';
import {MatIconModule} from "@angular/material/icon";
import { PostComponent } from './shared/post/post.component';
import { FeedComponent } from './feed/feed.component';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatBadgeModule} from "@angular/material/badge";
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { ProfileComponent } from './profile/profile.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatStepperModule} from "@angular/material/stepper";
import {MatDialogModule} from "@angular/material/dialog";
import { ParametersComponent } from './parameters/parameters.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { Error404Component } from './error404/error404.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { HttpClientModule } from '@angular/common/http';
import {CookieService} from "ngx-cookie-service";
import { CommentComponent } from './shared/comment/comment.component';
import { PagePostComponent } from './page-post/page-post.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChatsComponent } from './chats/chats.component';
import {MatListModule} from "@angular/material/list";

const config: SocketIoConfig = { url: 'http://localhost:3000', options: { transports : ['websocket'] } };

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PostComponent,
    FeedComponent,
    LoginComponent,
    CreateAccountComponent,
    ChatRoomComponent,
    CreatePostComponent,
    ProfileComponent,
    ParametersComponent,
    DeleteAccountComponent,
    UpdatePasswordComponent,
    Error404Component,
    Error404Component,
    CommentComponent,
    PagePostComponent,
    ChatsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatBadgeModule,
    MatMenuModule,
    MatStepperModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    SocketIoModule.forRoot(config),
    MatListModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
