// Layout.js
import { Outlet } from 'react-router-dom';
import MainHeading from './components/MainHeading';


const Layout = () => {
    return (
        <div>
            {/* Render MainHeading first */}
            <MainHeading data={{role:"C", items: [
                    { text: "Recruitment", link_path: "community/recruitment" },
                    { text: "Marketplace", link_path: "/community/listproduct" },
                    { text: "Store", link_path: "/community/store" },

                  ],}} />

            {/* Render the child components here using Outlet */}
            <main> 
                <Outlet />
            </main>
        </div>
    );
};



const LayoutTwo = () => {
    return (
        <div>
            {/* Render MainHeading first */}
            <MainHeading data={{role:"U", items: [
                    { text: "Recruitment", link_path: "user/recruitment" },
                    { text: "Marketplace", link_path: "/user/marketplace" },
                    { text: "Contests", link_path: "/user/contests" },

                  ]}} />

            {/* Render the child components here using Outlet */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export {Layout,LayoutTwo};
