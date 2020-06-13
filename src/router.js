import Router from "vue-router";
import Vue from "vue"
Vue.use(Router)
const routes=[
    {
        path:"/",
        component:q=>import("@/device/qunkong"),
        children: [
            {
                path: "/",
                component:devices=>import("@/device/Devices"),
				meta:{
					keepAlive:true
				}
            },
            {
                path:"/file",
                component:file=>import("@/device/file")
            },
            {
                path: "/task",
                name:"task",
                component: task => import("@/device/tasks"),

            },
            {
                path:"/taskList",
                component:task=>import("@/device/taskList")
            },
            {
                path: "/tel",
                component:tel=>import("@/device/tel")
            },
			{
			    path: "/clientAccount",
			    component:tel=>import("@/device/clientAccount")
			}
        ]
    }
]
export default new Router({
    routes
})

