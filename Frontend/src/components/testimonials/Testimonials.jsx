import React from "react";
import "./Testimonials.css";

const Testimonials = () => {
    const testimonialsData = [
        {
            id: 1,
            name: "Sujal Sahu",
            position: "Student",
            message:
                "This platform helped me learn so effectively. The courses are amazing and the instructors are top-notch.",
            image: "/testimonials/sujal.jpeg",
        },
        {
            id: 2,
            name: "Manish Chaudhry",
            position: "Student",
            message:
                "I've learned more here than in any other place. The interactive lessons and quizzes make learning enjoyable.",
            image: "/testimonials/manish.jpeg",
        },
        {
            id: 3,
            name: "Abhiraj Chaudhry ",
            position: "Student",
            message:
                "This platform helped me learn so effectively. The courses are amazing and the instructors are top-notch.",
            image: "/testimonials/abhiraj.jpeg",
        },
        {
            id: 4,
            name: "Minku Kumar",
            position: "Student",
            message:
                "I've learned more here than in any other place. The interactive lessons and quizzes make learning enjoyable.",
            image: "/testimonials/minku.jpeg",
        },
    ];
    return (
        <section className="testimonials">
            <h2>What our students say</h2>
            <div className="testmonials-cards">
                {testimonialsData.map((e) => (
                    <div className="testimonial-card" key={e.id}>
                        <div className="student-image">
                            <img src={e.image} alt="" />
                        </div>
                        <p className="message">{e.message}</p>
                        <div className="info">
                            <p className="name">{e.name}</p>
                            <p className="position">{e.position}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;