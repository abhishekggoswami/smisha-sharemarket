const mapSource = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.389784249118!2d73.955024!3d18.5564578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5a37ca71a18dde9%3A0xc556b3a904271aa5!2sSmisha%20Share%20Market%20Institute!5e0!3m2!1sen!2sin!4v1791182655647!5m2!1sen!2sin';

export default function AcademyMap({ className = '' }) {
  return <div className={`academy-map ${className}`}>
    <iframe src={mapSource} title="Smisha Share Market Institute location" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
  </div>;
}
