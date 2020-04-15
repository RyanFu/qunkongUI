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
                component:devices=>import("@/device/Devices")
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
            }
        ]
    }
]
export default new Router({
    routes
})

