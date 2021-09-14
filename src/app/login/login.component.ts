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
	}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
			center: ['', Validators.required]
		});
		this.getCenters();
		// get return url from route parameters or default to '/'
		// this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	getCenters = () => {
		this.spinner.show();
		this.configApi.getCenters().subscribe(
			resp => {
				console.log(resp.body);
				this.centers = resp.body;
				this.spinner.hide();
			},
			error => {
				this.spinner.hide();
				this.centers = [
					{
						'id': 1,
						'name': 'Kasegaon'
					},
					{
						'id': 2,
						'name': 'Kalamwadi'
					}
				];
				this.toastr.error('Something Went Wrong', '', { timeOut: 1200 });
			}
		);
	}

	getUserLogIn = (req) => {
		this.spinner.show();
		this.configApi.userLogin(req).subscribe(
			resp => {
				console.log(resp.body);
				localStorage.setItem('isUserLoggedIn', 'true');
				this.spinner.hide();
			},
			error => {
				this.spinner.hide();
				// localStorage.removeItem('isUserLoggedIn');
				const loggedInUser = {
					'userName': 'Santosh S',
					'center': 'Kasegaon',
					'centerId': 1
				}
				localStorage.setItem('isUserLoggedIn', 'true');
				localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
				this.router.navigate(['/customers']);
				this.toastr.error('Something Went Wrong', '', { timeOut: 1200 });
			}
		);
	}
	// convenience getter for easy access to form fields
	get f() { return this.loginForm.controls; }

	onSubmit() {
		this.submitted = true;
		// stop here if form is invalid
		if (this.loginForm.invalid) {
			return;
		}

		this.getUserLogIn(this.loginForm.value);
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
