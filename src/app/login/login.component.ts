import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { WebApiService } from '../web.api.services';
import { ToastrService } from 'ngx-toastr';
// import { first } from 'rxjs/operators';

// import { AuthenticationService } from '../../app/_services';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
	username: any = '';
	password: any = '';
	center: any = '';
	centers: any = [];

	loginForm: FormGroup;
	loading = false;
	submitted = false;
	returnUrl: string;
	error = '';

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private spinner: NgxSpinnerService,
		public configApi: WebApiService,
		private toastr: ToastrService
		// private authenticationService: AuthenticationService
	) {
		// redirect to home if already logged in
		// if (this.authenticationService.currentUserValue) {
		// 	this.router.navigate(['/']);
		// }
		this.getCenters();
	}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
			center: ['', Validators.required]
		});
		// get return url from route parameters or default to '/'
		// this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	getCenters = () => {
		this.spinner.show();
		this.configApi.getCenters().subscribe(
			resp => {
				this.centers = resp.body['body'];
				this.spinner.hide();
			},
			error => {
				this.spinner.hide();
				this.toastr.error(error.body['message'], '', { timeOut: 1200 });
			}
		);
	}
	centerChange = (e) => {
		const centerSelected = this.centers.find(x=>{
			return x.id === this.center
		});
		localStorage.setItem('centerId', centerSelected.id);
		localStorage.setItem('centerName', centerSelected.name);
	}
	getUserLogIn = (req) => {
		this.spinner.show();
		this.configApi.userLogin(req).subscribe(
			resp => {
				console.log(resp.body);
				if (resp.body['success']) {
					localStorage.setItem('isUserLoggedIn', 'true');
					localStorage.setItem('loggedInUser', JSON.stringify(resp.body['body']));
					this.router.navigate(['/customers']);
				} else {
					this.toastr.error(resp.body['message'], '', { timeOut: 1200 });
				}
				this.spinner.hide();
			},
			error => {
				this.spinner.hide();
				localStorage.removeItem('isUserLoggedIn');
				this.toastr.error(error.body['message'], '', { timeOut: 1200 });
			}
		);
	}
	// convenience getter for easy access to form fields
	get f() { return this.loginForm.controls; }

	onSubmit() {
		setTimeout(x=> {
			this.submitted = true;
			// stop here if form is invalid
			if (this.loginForm.invalid) {
				return;
			}
			let req = {
				"user_contact": this.loginForm.value.username,
				"user_password": this.loginForm.value.password
			}
			this.getUserLogIn(req);
		}, 300);
		// this.loading = true;
		// this.authenticationService.login(this.f.username.value, this.f.password.value)
		// 	.pipe(first())
		// 	.subscribe(
		// 		data => {
		// 			this.router.navigate([this.returnUrl]);
		// 		},
		// 		error => {
		// 			this.error = error;
		// 			this.loading = false;
		// 		});
	}
}
