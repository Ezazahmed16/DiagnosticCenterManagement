import { auth } from "@clerk/nextjs/server";

export const ITEM_PER_PAGE = 15;

type RouteAccessMap = {
    [key: string]: string[];
  };
  
  export const routeAccessMap: RouteAccessMap = {
    // Admin access
    "/dashboard(.*)": ["admin", "receptionist", "accounts", "inventory", ],
  
    // Receptionist access
    "/receptionist(.*)": ["receptionist", "admin"],
    "/receptionist/all-patients(.*)": ["receptionist", "admin"],
    "/receptionist/all-memos": ["receptionist", "admin"],
  
    // Accounts access
    "/accounts(.*)": ["accounts", "admin"],
    "/accounts/expense": ["accounts", "admin"],
  
    // Inventory access
    "/inventory(.*)": ["inventory", "admin"],
    "/inventory/inventoryassets": ["inventory", "admin"],
  
    // Settings access
    "/settings/addrole": ["admin"],
    "/settings/addtest": ["admin"],
    "/settings/addexpensetype": ["admin"],
    "/settings/addreferral": ["admin"],
 
  };


  