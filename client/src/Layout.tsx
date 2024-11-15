// Layout.js
import { Outlet } from 'react-router-dom';
import MainHeading from './components/MainHeading';


const Layout = () => {
    return (
        <div>
            {/* Render MainHeading first */}
            <MainHeading data={{role:"C"}} />

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
            <MainHeading data={{role:"U"}} />

            {/* Render the child components here using Outlet */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export {Layout,LayoutTwo};
