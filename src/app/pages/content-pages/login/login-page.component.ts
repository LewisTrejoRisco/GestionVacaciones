import { Component, ViewChild } from '@angular/core';
import { NgForm, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {

  loginFormSubmitted = false;
  isLoginFailed = false;
  token: any = null;
  user: any = null;
  sesion: any = null;
  imagenUrl: string;

  loginForm = new UntypedFormGroup({
    username: new UntypedFormControl('', [Validators.required]),
    password: new UntypedFormControl('', [Validators.required])
    // rememberMe: new UntypedFormControl(true)
  });


  constructor(private router: Router, private authService: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute) {
  }

  get lf() {
    return this.loginForm.controls;
  }

  // On submit button click
  onSubmit() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show(undefined,
      {
        type: 'ball-triangle-path',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
      });
    
    this.authService.obtenerToken().subscribe(
      resp => {
        this.token = resp;
        this.authService.guardarToken(JSON.stringify(resp))
        this.authService.autenticarUsuario(this.loginForm.value.username, this.loginForm.value.password, this.token.token).subscribe(
          resp => {
            this.user = resp;
            //console.log(this.user);
            if (this.user.p_mensavis == '0'){
              this.authService.signupUser(this.user.trabajador.codigoMatricula)
                .subscribe(res => {
                  this.sesion = res;
                  if (this.sesion.p_menserro == null) {
                    this.authService.obtenerFoto(this.sesion.p_codipers, this.token.token).subscribe(
                      (imagen: Blob) =>{
                        this.createImageFromBlob(imagen);
                      }, error=> {
                        console.log(error)
                      }
                    )
                  } else {
                    this.isLoginFailed = true;
                    this.spinner.hide();
                    Swal.fire(
                      'Error',
                      this.sesion.p_menserro,
                      'error'
                    );
                  }
                }, error => {
                  this.isLoginFailed = true;
                  this.spinner.hide();
                  Swal.fire(
                    'Error',
                    'error al obtener datos del colaborador',
                    'error'
                  );
                }
              )
            } else {
              Swal.fire(
                'Error',
                'error al autenticar colaborador, vuelva a digitar el usuario o clave',
                'error'
              );
            }
          },
          error => {
            Swal.fire(
              'Error',
              'error al autenticar colaborador, vuelva a digitar el usuario o clave',
              'error'
            );
          }
        )
      }, 
      error => {
          this.isLoginFailed = true;
          this.spinner.hide();
        //console.log("Error: " + error.message)
        Swal.fire(
          'Error',
          'error al generar Token:'+ error.message,
          'error'
        );
      }
    );
      // .catch((err) => {
      //   this.isLoginFailed = true;
      //   this.spinner.hide();
      //   //console.log('error: ' + err)
      // }
      // );
  }
  // Convierte la imagen Blob en una URL para mostrarla en la vista
  createImageFromBlob(image: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imagenUrl = reader.result as string;
      this.sesion.p_foto = this.imagenUrl
      //console.log(this.sesion)
      this.authService.guardarSesion(JSON.stringify(this.sesion));
      this.spinner.hide();
      this.router.navigate(['/vacaciones/solicitar']);
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

}
