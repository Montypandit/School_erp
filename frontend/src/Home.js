import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [hovered, setHovered] = React.useState(null);
    const [navHovered, setNavHovered] = React.useState(null);

    const linkStyle = {
        display: 'block',
        width: '280px',
        margin: '15px 0',
        padding: '18px 25px',
        fontSize: '1.3em',
        fontWeight: '600',
        textDecoration: 'none',
        color: 'white',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '15px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        overflow: 'hidden',
    };

    const navLinkStyle = {
        color: '#666',
        textDecoration: 'none',
        padding: '10px 20px',
        borderRadius: '25px',
        transition: 'all 0.3s ease',
        fontWeight: '500',
        position: 'relative',
    };

    return (
        <div style={{ 
            minHeight: '100vh',
            background: '#ffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Navbar */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '80px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 40px',
                zIndex: 1000,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
                {/* Logo */}
                <div style={{
                    fontSize: '2em',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-1px',
                }}>
                    ERP
                </div>

                {/* Nav Links */}
                <div style={{ display: 'flex', gap: '20px',  }}>
                    <a 
                        href="#contact"
                        style={navHovered === 'contact' ? {
                            ...navLinkStyle,
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)',
                        } : navLinkStyle}
                        onMouseEnter={() => setNavHovered('contact')}
                        onMouseLeave={() => setNavHovered(null)}
                    >
                        Contact
                    </a>
                    <a 
                        href="#help"
                        style={navHovered === 'help' ? {
                            ...navLinkStyle,
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)',
                        } : navLinkStyle}
                        onMouseEnter={() => setNavHovered('help')}
                        onMouseLeave={() => setNavHovered(null)}
                    >
                        Help
                    </a>
                </div>
            </nav>

            {/* Main Content */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '100px 20px 40px',
                position: 'relative',
            }}>
                {/* Floating Elements for Visual Interest */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    animation: 'float 6s ease-in-out infinite',
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '60%',
                    right: '15%',
                    width: '80px',
                    height: '80px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    animation: 'float 8s ease-in-out infinite reverse',
                }}></div>

                {/* Main Card */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    padding: '60px 50px',
                    borderRadius: '25px',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '400px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(0)',
                    transition: 'transform 0.3s ease',
                }}>
                    <h1 style={{ 
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '20px',
                        fontSize: '2.5em',
                        fontWeight: '700',
                        letterSpacing: '-1px',
                        lineHeight: '1.2',
                    }}>
                        Welcome to ERP
                    </h1>
                    <p style={{
                        color: '#666',
                        fontSize: '1.1em',
                        marginBottom: '40px',
                        maxWidth: '300px',
                        lineHeight: '1.6',
                    }}>
                        Choose your role to access the school management system
                    </p>
                    
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        gap: '5px',
                    }}>
                        <Link
                            to="/admin/login"
                            style={hovered === 'admin' ? {
                                ...linkStyle,
                                background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                                transform: 'translateY(-5px) scale(1.05)',
                                boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
                            } : linkStyle}
                            onMouseEnter={() => setHovered('admin')}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <span style={{ position: 'relative', zIndex: 2 }}>👨‍💼 Admin Portal</span>
                        </Link>
                        
                        <Link
                            to="/teacherhome"
                            style={hovered === 'teacher' ? {
                                ...linkStyle,
                                background: 'linear-gradient(135deg, #48bb78, #38a169)',
                                transform: 'translateY(-5px) scale(1.05)',
                                boxShadow: '0 15px 35px rgba(72, 187, 120, 0.4)',
                            } : {
                                ...linkStyle,
                                background: 'linear-gradient(135deg, #48bb78, #38a169)',
                                boxShadow: '0 8px 25px rgba(72, 187, 120, 0.3)',
                            }}
                            onMouseEnter={() => setHovered('teacher')}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <span style={{ position: 'relative', zIndex: 2 }}>👩‍🏫 Teacher Portal</span>
                        </Link>
                        
                        <Link
                            to="/coordinator/login"
                            style={hovered === 'student' ? {
                                ...linkStyle,
                                background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
                                transform: 'translateY(-5px) scale(1.05)',
                                boxShadow: '0 15px 35px rgba(237, 137, 54, 0.4)',
                            } : {
                                ...linkStyle,
                                background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
                                boxShadow: '0 8px 25px rgba(237, 137, 54, 0.3)',
                            }}
                            onMouseEnter={() => setHovered('student')}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <span style={{ position: 'relative', zIndex: 2 }}>🎓 Coordinator Portal</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                @media (max-width: 768px) {
                    nav {
                        padding: 0 20px !important;
                    }
                    nav > div:first-child {
                        font-size: 1.5em !important;
                    }
                    nav > div:last-child {
                        gap: 10px !important;
                    }
                    nav > div:last-child a {
                        padding: 8px 15px !important;
                        font-size: 0.9em !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;