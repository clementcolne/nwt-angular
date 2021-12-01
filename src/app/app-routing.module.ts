import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FeedComponent} from "./feed/feed.component";
import {LoginComponent} from "./login/login.component";
import {CreateAccountComponent} from "./create-account/create-account.component";
import {ChatRoomComponent} from "./chat-room/chat-room.component";
import {ProfileComponent} from "./profile/profile.component";
import {CreatePostComponent} from "./create-post/create-post.component";
import {ParametersComponent} from "./parameters/parameters.component";
import {Error404Component} from "./error404/error404.component";
import {AuthGuard} from "./shared/guards/auth.guard";
import {PagePostComponent} from "./page-post/page-post.component";
import {ChatsComponent} from "./chats/chats.component";

const routes: Routes = [
  { path: "", component: FeedComponent, canActivate: [AuthGuard] },
  { path: "connexion", component: LoginComponent },
  { path: "creer-compte", component: CreateAccountComponent },
  { path: "chats", component: ChatsComponent, canActivate: [AuthGuard] },
  { path: "chat-room/:id", component: ChatRoomComponent, canActivate: [AuthGuard] },
  { path: "profil/:username", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "parameters", component: ParametersComponent, canActivate: [AuthGuard] },
  { path: "creer-post", component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: "post/:id", component: PagePostComponent, canActivate: [AuthGuard] },
  { path: "**", component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
