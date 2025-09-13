import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { CommonsService } from '../services/commons.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class CommonsListDependencesResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllDependences();
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommonsListCoordinatiosResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllCoordination();
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommonsListManagmentsResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllManagements();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListPositionsResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllPositions();
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommonsListRolesResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllRoles();
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommonsListCountriesResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllCountries();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListStatusResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllStatus();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListSocialNetworkResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllSocialNetwork();
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommonsListInputTypeResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllInputsType();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListCategoyTypeResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllCategories();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListUnitsTypeResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllUnitsType();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListColorsCalendarResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllColorSticker();
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommonsListUsersEmailsResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllUsersEmails();
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommonsListInstrumentsResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllInstruments();
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommonsListComponentTypesResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllComponentTypes();
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommonsListAuthtoritationsResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllAuthorizations();
  }
}



@Injectable({
  providedIn: 'root'
})
export class CommonsListOptionsMenuResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllMenuOptions();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListModulesResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllModules();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListEmailAccountsTypeResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllEmailAccountsType();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListUsersResolver implements Resolve<any> {
  constructor(private userService: UserService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.userService.getAllUsers();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListChargesResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllChargesType();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListLevelsResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllLevelsType();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListAccreditationTypeResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllAccreditationType();
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommonsListDepartmentsResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getDepartments();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListRolesAllCompaniesResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllRolesList();
  }

}



@Injectable({
  providedIn: 'root'
})

export class CommonsListInstrumentCapResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllInstrumentsCapActive();
  }
}



@Injectable({
  providedIn: 'root'
})
export class CommonsListInstrumentEvaResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllInstrumentsEvaActive();
  }
}




@Injectable({
  providedIn: 'root'
})
export class CommonsListInstrumentEva360TypesResolver implements Resolve<any> {
  constructor(private commonsService: CommonsService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllEvaluations360IntumentsType();
  }
}



@Injectable({
  providedIn: 'root'
})
export class CommonsListCompetencies360Resolver implements Resolve<any> {
  constructor(private commonsService: CommonsService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllCategories360();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListUnits360Resolver implements Resolve<any> {
  constructor(private commonsService: CommonsService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllUnits360();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CommonsListDomainLevels360Resolver implements Resolve<any> {
  constructor(private commonsService: CommonsService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.commonsService.getAllDomainLevels360();
  }
}






