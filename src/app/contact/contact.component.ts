import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut } from '../animations/app.animations';
import {FeedbackService} from '../services/feedback.service'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations:[
    flyInOut()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  errMess: string;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;

  formErrors ={
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname':{
      'required': 'First Name is required',
      'minlength': 'Name must be longer',
      'maxlength': 'too long'
    },
    'lastname':{
      'required': 'Last Name is required',
      'minlength': 'Name must be longer',
      'maxlength': 'too long'
    },
    'telnum': {
      'required': 'Tel required',
      'pattern': 'must only contain numbers'
    },
    'email': {
      'required': 'email required',
      'email': 'must only contain @'
    }
  }

  constructor(private fb: FormBuilder, private feedbackService: FeedbackService,) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(12)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(12)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }


  onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.feedbackService.putFeedback(this.feedback)
    .subscribe( feedback  => {
      this.feedback = feedback;
    },
    errmess => { this.feedback = null; this.errMess = <any>errmess}
    )
    
    setTimeout(() => {

      this.feedbackForm.reset({
        firstname: '',
        lastname: '',
        telnum: '',
        email: '',
        agree: false,
        contacttype: 'None',
        message: ''
      });
      this.feedbackFormDirective.resetForm();
      
    }, 4000);

 
  }

}
