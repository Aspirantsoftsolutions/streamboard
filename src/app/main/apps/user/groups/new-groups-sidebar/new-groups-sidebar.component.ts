import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { GroupsListService } from '../groups-list.service';
import { CommonService } from '../../common.service';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { StudentsListService } from '../../students/students-list.service';
import { ClassesListService } from '../../classes/classes-list.service';
import { GradesListService } from '../../grades/grades-list.service';

@Component({
  selector: 'app-new-groups-sidebar',
  templateUrl: './new-groups-sidebar.component.html'
})
export class NewGroupsSidebarComponent implements OnInit {
  public fullname;
  public class;
  public id;
  public isToUpdate = false;
  public groupId;
  public selectedUsers = [];
  public classDropdownSettings;
  public users = [];
  public classes = [];
  public grades;
  public grade;
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _groupService: GroupsListService,
    private _commonService: CommonService,
    private _studentListService: StudentsListService,
    public _gradeListService: GradesListService,
    private _classListService: ClassesListService) {
    this.classDropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'username',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this._commonService.onUserEditListChanged.subscribe(response => {
      if (response.groupinfo != null) {
        this.isToUpdate = true;
        this.fullname = response.groupinfo.name;
        this.id = response.groupinfo._id;
        if (Array.isArray(response.groupinfo.students)) {
          this.selectedUsers = response.groupinfo.students;
        }
        if (Array.isArray(response.allStudents)) {
          this.users = response.allStudents;
        }
      } else {
        this.isToUpdate = false;
      }
    });

    this._studentListService.onStudentListChanged.subscribe((list) => {
      this.users = list;
    });

    this.classes = this._classListService.onUserListChanged.getValue();

    this._classListService.onUserListChanged.subscribe((list) => {
      this.classes = list;
    });

    // this._commonService.onStudentsSelected.subscribe(resp => {
    //   if (Array.isArray(resp)) {
    //     this.selectedUsers = resp.map(x => x._id);
    //   }
    // });

  }

  onClassSelect(classId) {
    this.users = this.classes.find(clas => clas._id === classId).students;
  }

  onGradeSelect(classId) {
    this.grade = this.classes.find(clas => clas._id === classId).students;
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    // this._groupService.classRows = null;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }


  onItemSelect(item: any) {
    const devices = this.selectedUsers.filter(x => x._id === item._id);
    if (!devices) {
      this.selectedUsers.push(item);
    }
  }
  onSelectAll(items: any) {
    this.selectedUsers = items;
  }
  onDeselect(item: any) {
    this.selectedUsers = this.selectedUsers.filter(x => x._id != item._id);
  }

  onDeselectAll(items: any) {
    this.selectedUsers = items;
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    if (form.valid) {
      console.log(form);
      if (!this.id) {
        this._groupService.createGroup(form.value, this.selectedUsers, this.grade).then((resposne) => {
          console.log('res set:', resposne);
          let successString = Response;
          this.toastr.success('👋 updated Successfully.', 'Success!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
          this._commonService.getDataTableRows();
        }, (error) => {
          console.log('res set error:', error);
          let errorString = error;
          this.toastr.error(errorString, 'Error!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
        }
        );
      } else {
        this._groupService.createGroup({ ...form.value, id: this.id }, this.selectedUsers,this.grade).then((resposne: any) => {
          console.log('res set:', resposne);
          let successString = resposne;
          if (this._groupService.classRows != null) {
            this._groupService.classRows.map(row => {
              console.log('current rows id', row.userId);
              this._groupService.setUserClass(resposne.data.userId, row.userId).then((response) => {
                console.log('res udpate:', response);
                // let successString = response;
                this.toastMessage('success', 'updated Successfully.');
              }, (error) => {
                console.log('res set error:', error);
                let errorString = error;
                this.toastMessage('error', error.message || Error!);
              });
            });
          }

          this.toastr.success('👋 User Created Successfully.', 'Success!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
          if (this._groupService.classRows == null)
            this._groupService.getDataTableRows();
        }, (error) => {
          console.log('res set error:', error);
          let errorString = error;
          this.toastr.error(errorString, 'Error!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
        }
        );
      }

      this.toggleSidebar('new-groups-sidebar');
    }
  }

  search($event) {
    console.log($event);
  }

  toastMessage(type, msg) {
    if (type === 'success') {
      this.toastr.success(msg, 'Success!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    } else if (type = 'error') {
      this.toastr.error(msg, 'Error!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    }
  }

  ngOnInit(): void {
    this._gradeListService.getDataTableRows().then((resposne) => {
      console.log('res set Grades:', resposne);
      this.grades = resposne;
      console.log('grades:', this.grades);
    }, (error) => {
      console.log('res set error:', error);
    });
  }
}
