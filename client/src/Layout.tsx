// Layout.js
import { Outlet } from 'react-router-dom';
import MainHeading from './components/MainHeading';


const Layout = () => {
    return (
        <div>
            {/* Render MainHeading first */}
            <MainHeading data={{role:"C", items: [
                    { text: "Recruitment", link_path: "/community/recruitment" },
                    { text: "List Product", link_path: "/community/listproduct" },
                    { text: "Verification", link_path: "/community/verification" },

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
                    { text: "quizzes", link_path: "/user/quiz" },

                  ]}} />

            {/* Render the child components here using Outlet */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export {Layout,LayoutTwo};
