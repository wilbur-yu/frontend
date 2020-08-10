import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SimpleGuard } from "@delon/auth";
import { environment } from "@env/environment";
// layout
import { LayoutDefaultComponent } from "../layout/default/default.component";
import { LayoutFullScreenComponent } from "../layout/fullscreen/fullscreen.component";
import { LayoutPassportComponent } from "../layout/passport/passport.component";
import { UserLoginComponent } from "./passport/login/login.component";
import { UserRegisterResultComponent } from "./passport/register-result/register-result.component";
import { UserRegisterComponent } from "./passport/register/register.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutDefaultComponent,
    canActivate: [SimpleGuard],
    canActivateChild: [SimpleGuard],
    children: [
      { path: "", redirectTo: "dashboard/v1", pathMatch: "full" },
      { path: "dashboard", redirectTo: "dashboard/v1", pathMatch: "full" },
      {
        path: "widgets",
        loadChildren: () =>
          import("./widgets/widgets.module").then((m) => m.WidgetsModule),
      },
      // Exception
      {
        path: "exception",
        loadChildren: () =>
          import("./exception/exception.module").then((m) => m.ExceptionModule),
      },
    ],
  },
  // passport
  {
    path: "passport",
    component: LayoutPassportComponent,
    children: [
      {
        path: "login",
        component: UserLoginComponent,
        data: { title: "登录", titleI18n: "app.login.login" },
      },
      {
        path: "register",
        component: UserRegisterComponent,
        data: { title: "注册", titleI18n: "app.register.register" },
      },
      {
        path: "register-result",
        component: UserRegisterResultComponent,
        data: { title: "注册结果", titleI18n: "app.register.register" },
      },
    ],
  },
  // 单页不包裹Layout
  { path: "**", redirectTo: "exception/404" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: "top",
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
