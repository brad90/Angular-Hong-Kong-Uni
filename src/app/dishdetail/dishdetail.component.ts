import { Component, OnInit, Input, ViewChild, Inject} from '@angular/core';
import {Dish} from '../shared/dish'
import {Params, ActivatedRoute} from '@angular/router'
import {Location} from '@angular/common'
import { DishService } from '../services/dish.service'
import { switchMap } from 'rxjs/operators'
import { Comment } from '../shared/comment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { Feedback, ContactType } from '../shared/feedback';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;


  commentForm: FormGroup;
  comment: Comment;
  @ViewChild('dform') commentFormDirective;
  dishcopy:Dish;
  formErrors ={
    'author': '',
    'rating': 5,
    'comment': '',
  };

  validationMessages = {
    'author':{
      'required': 'Full name is required',
    },
    'rating':{
      'required': 'Rating is required',
    },
    'comment':{
      'required': 'Comment is required',
    }

  }
  

  constructor( 
    private dishservice: DishService,
    private location: Location, 
    private route: ActivatedRoute,
    private fb: FormBuilder,
    @Inject('BaseURL') private baseURL
    ) 
    {
      this.createForm();
     }

  ngOnInit() {

  this.dishservice.getDishIds().subscribe((dishIds) => this.dishIds = dishIds)
  this.route.params.pipe(switchMap((params: Params) => this.dishservice.getD(params['id'])))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id) },
    errmess => this.errMess = <any>errmess);
  }

  createForm(){
    this.commentForm = this.fb.group({
      'author':["", [Validators.required]],
      'rating': [5 , [Validators.required]],
      'comment': ["", [Validators.required]]
    })

    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
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

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    console.log(this.comment);
    this.comment.date = new Date().toISOString()
    this.dishcopy.comments.push(this.comment)
    this.dishservice.putDish(this.dishcopy)
      .subscribe( dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess}
      )
    this.commentForm.reset({
      'author': '',
      'rating': 0,
      'comment': '',
    });
    this.commentFormDirective.resetForm();
  }

}
