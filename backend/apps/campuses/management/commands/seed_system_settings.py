from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
import base64
from apps.campuses.models import Campus, Faculty, Department
from apps.courses.models import Course
from apps.communications.models import SMSTemplate, Signature
from apps.authentication.models import User


class Command(BaseCommand):
    help = 'Seed initial data for System Settings (Campuses, Faculties, Departments, Courses, SMS Templates, Signatures)'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting System Settings data seeding...'))

        # Create Campuses
        self.stdout.write('Creating campuses...')
        main_campus, _ = Campus.objects.get_or_create(
            code='MC',
            defaults={
                'name': 'Main Campus - Magburaka',
                'address': 'Magburaka, Tonkolili District',
                'city': 'Magburaka',
                'state': 'Northern Province',
                'country': 'Sierra Leone',
                'phone': '+232-76-123456',
                'email': 'main@ebkust.edu.sl',
                'is_active': True,
            }
        )

        freetown_campus, _ = Campus.objects.get_or_create(
            code='FC',
            defaults={
                'name': 'Freetown Campus',
                'address': 'Tower Hill, Freetown',
                'city': 'Freetown',
                'state': 'Western Area',
                'country': 'Sierra Leone',
                'phone': '+232-76-654321',
                'email': 'freetown@ebkust.edu.sl',
                'is_active': True,
            }
        )

        bo_campus, _ = Campus.objects.get_or_create(
            code='BC',
            defaults={
                'name': 'Bo Campus',
                'address': 'Bo City Center',
                'city': 'Bo',
                'state': 'Southern Province',
                'country': 'Sierra Leone',
                'phone': '+232-76-987654',
                'email': 'bo@ebkust.edu.sl',
                'is_active': True,
            }
        )

        self.stdout.write(self.style.SUCCESS(f'Created {Campus.objects.count()} campuses'))

        # Create Faculties
        self.stdout.write('Creating faculties...')

        # Main Campus Faculties
        engineering_faculty, _ = Faculty.objects.get_or_create(
            code='ENG',
            campus=main_campus,
            defaults={
                'name': 'Faculty of Engineering',
                'description': 'Faculty of Engineering and Technology',
            }
        )

        science_faculty, _ = Faculty.objects.get_or_create(
            code='SCI',
            campus=main_campus,
            defaults={
                'name': 'Faculty of Science',
                'description': 'Faculty of Pure and Applied Sciences',
            }
        )

        # Freetown Campus Faculties
        business_faculty, _ = Faculty.objects.get_or_create(
            code='BUS',
            campus=freetown_campus,
            defaults={
                'name': 'Faculty of Business Administration',
                'description': 'School of Business and Management',
            }
        )

        social_sciences_faculty, _ = Faculty.objects.get_or_create(
            code='SOC',
            campus=freetown_campus,
            defaults={
                'name': 'Faculty of Social Sciences',
                'description': 'Faculty of Social Sciences and Humanities',
            }
        )

        self.stdout.write(self.style.SUCCESS(f'Created {Faculty.objects.count()} faculties'))

        # Create Departments
        self.stdout.write('Creating departments...')

        # Engineering Departments
        civil_dept, _ = Department.objects.get_or_create(
            code='CE',
            campus=main_campus,
            defaults={
                'name': 'Civil Engineering',
                'description': 'Department of Civil Engineering',
                'is_active': True,
            }
        )

        electrical_dept, _ = Department.objects.get_or_create(
            code='EE',
            campus=main_campus,
            defaults={
                'name': 'Electrical Engineering',
                'description': 'Department of Electrical and Electronics Engineering',
                'is_active': True,
            }
        )

        computer_dept, _ = Department.objects.get_or_create(
            code='CSC',
            campus=main_campus,
            defaults={
                'name': 'Computer Science',
                'description': 'Department of Computer Science and Information Technology',
                'is_active': True,
            }
        )

        # Science Departments
        physics_dept, _ = Department.objects.get_or_create(
            code='PHY',
            campus=main_campus,
            defaults={
                'name': 'Physics',
                'description': 'Department of Physics',
                'is_active': True,
            }
        )

        chemistry_dept, _ = Department.objects.get_or_create(
            code='CHM',
            campus=main_campus,
            defaults={
                'name': 'Chemistry',
                'description': 'Department of Chemistry',
                'is_active': True,
            }
        )

        # Business Departments
        accounting_dept, _ = Department.objects.get_or_create(
            code='ACC',
            campus=freetown_campus,
            defaults={
                'name': 'Accounting',
                'description': 'Department of Accounting and Finance',
                'is_active': True,
            }
        )

        marketing_dept, _ = Department.objects.get_or_create(
            code='MKT',
            campus=freetown_campus,
            defaults={
                'name': 'Marketing',
                'description': 'Department of Marketing and Sales',
                'is_active': True,
            }
        )

        self.stdout.write(self.style.SUCCESS(f'Created {Department.objects.count()} departments'))

        # Create Courses
        self.stdout.write('Creating courses...')

        courses_data = [
            # Computer Science Courses
            {'code': 'CSC101', 'title': 'Introduction to Programming', 'credits': 3, 'department': computer_dept, 'description': 'Basic programming concepts using Python'},
            {'code': 'CSC201', 'title': 'Data Structures', 'credits': 4, 'department': computer_dept, 'description': 'Study of data structures and algorithms'},
            {'code': 'CSC301', 'title': 'Database Systems', 'credits': 3, 'department': computer_dept, 'description': 'Database design and SQL'},
            {'code': 'CSC401', 'title': 'Software Engineering', 'credits': 4, 'department': computer_dept, 'description': 'Software development lifecycle'},

            # Electrical Engineering Courses
            {'code': 'EE101', 'title': 'Circuit Analysis', 'credits': 4, 'department': electrical_dept, 'description': 'Basic circuit theory'},
            {'code': 'EE201', 'title': 'Electronics', 'credits': 4, 'department': electrical_dept, 'description': 'Electronic devices and circuits'},
            {'code': 'EE301', 'title': 'Power Systems', 'credits': 3, 'department': electrical_dept, 'description': 'Electric power generation and distribution'},

            # Civil Engineering Courses
            {'code': 'CE101', 'title': 'Engineering Mechanics', 'credits': 4, 'department': civil_dept, 'description': 'Statics and dynamics'},
            {'code': 'CE201', 'title': 'Structural Analysis', 'credits': 4, 'department': civil_dept, 'description': 'Analysis of structures'},
            {'code': 'CE301', 'title': 'Geotechnical Engineering', 'credits': 3, 'department': civil_dept, 'description': 'Soil mechanics and foundation engineering'},

            # Physics Courses
            {'code': 'PHY101', 'title': 'General Physics I', 'credits': 4, 'department': physics_dept, 'description': 'Mechanics and thermodynamics'},
            {'code': 'PHY201', 'title': 'General Physics II', 'credits': 4, 'department': physics_dept, 'description': 'Electricity and magnetism'},

            # Chemistry Courses
            {'code': 'CHM101', 'title': 'General Chemistry I', 'credits': 4, 'department': chemistry_dept, 'description': 'Basic chemistry principles'},
            {'code': 'CHM201', 'title': 'Organic Chemistry', 'credits': 4, 'department': chemistry_dept, 'description': 'Study of organic compounds'},

            # Accounting Courses
            {'code': 'ACC101', 'title': 'Financial Accounting', 'credits': 3, 'department': accounting_dept, 'description': 'Basic accounting principles'},
            {'code': 'ACC201', 'title': 'Managerial Accounting', 'credits': 3, 'department': accounting_dept, 'description': 'Management accounting concepts'},

            # Marketing Courses
            {'code': 'MKT101', 'title': 'Principles of Marketing', 'credits': 3, 'department': marketing_dept, 'description': 'Introduction to marketing'},
            {'code': 'MKT201', 'title': 'Consumer Behavior', 'credits': 3, 'department': marketing_dept, 'description': 'Study of consumer psychology'},
        ]

        for course_data in courses_data:
            Course.objects.get_or_create(
                code=course_data['code'],
                defaults={
                    'title': course_data['title'],
                    'credits': course_data['credits'],
                    'department': course_data['department'],
                    'campus': course_data['department'].campus,
                    'description': course_data['description'],
                    'is_elective': False,
                    'is_active': True,
                }
            )

        self.stdout.write(self.style.SUCCESS(f'Created {Course.objects.count()} courses'))

        # Create SMS Templates
        self.stdout.write('Creating SMS templates...')

        templates_data = [
            {
                'name': 'Admission Notification',
                'template_type': 'ADMISSION',
                'message': 'Congratulations {student_name}! You have been admitted to {campus_name} for the {semester} semester. Your student ID is {student_id}. Welcome to EBKUST!',
                'description': 'Sent to students upon admission',
                'placeholders': ['student_name', 'campus_name', 'semester', 'student_id'],
            },
            {
                'name': 'Payment Confirmation',
                'template_type': 'PAYMENT',
                'message': 'Dear {student_name}, your payment of Le{amount} has been received on {date}. Receipt number: {receipt_number}. Thank you.',
                'description': 'Sent after successful payment',
                'placeholders': ['student_name', 'amount', 'date', 'receipt_number'],
            },
            {
                'name': 'Exam Schedule',
                'template_type': 'EXAM',
                'message': 'Dear {student_name}, your {course_name} exam is scheduled for {date} at {time}. Venue: {venue}. Good luck!',
                'description': 'Exam schedule notification',
                'placeholders': ['student_name', 'course_name', 'date', 'time', 'venue'],
            },
            {
                'name': 'Registration Reminder',
                'template_type': 'REGISTRATION',
                'message': 'Dear {student_name}, course registration for {semester} semester ends on {date}. Please complete your registration to avoid penalties.',
                'description': 'Course registration reminder',
                'placeholders': ['student_name', 'semester', 'date'],
            },
            {
                'name': 'Results Published',
                'template_type': 'RESULTS',
                'message': 'Dear {student_name}, your results for {semester} semester are now available. Your GPA: {gpa}. Login to the portal to view details.',
                'description': 'Results publication notification',
                'placeholders': ['student_name', 'semester', 'gpa'],
            },
            {
                'name': 'General Announcement',
                'template_type': 'GENERAL',
                'message': 'EBKUST Notice: {message}. For more information, contact {contact}.',
                'description': 'General announcements',
                'placeholders': ['message', 'contact'],
            },
            {
                'name': 'Emergency Alert',
                'template_type': 'ALERT',
                'message': 'URGENT: {message}. This is an emergency notification from EBKUST. Please take necessary action.',
                'description': 'Emergency notifications',
                'placeholders': ['message'],
            },
        ]

        for template_data in templates_data:
            SMSTemplate.objects.get_or_create(
                name=template_data['name'],
                defaults={
                    'template_type': template_data['template_type'],
                    'message': template_data['message'],
                    'description': template_data['description'],
                    'available_placeholders': template_data['placeholders'],
                    'is_active': True,
                }
            )

        self.stdout.write(self.style.SUCCESS(f'Created {SMSTemplate.objects.count()} SMS templates'))

        # Create Signatures
        self.stdout.write('Creating signatures...')

        # Create a simple placeholder signature image (1x1 pixel transparent PNG)
        # In production, these would be actual signature images
        placeholder_image = base64.b64decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        )

        signatures_data = [
            {
                'official_name': 'Prof. Dr. Ibrahim Koroma',
                'title': 'Vice Chancellor',
                'department': 'Office of the Vice Chancellor',
                'campus': main_campus,
                'is_default': True,
            },
            {
                'official_name': 'Dr. Fatmata Sesay',
                'title': 'Registrar',
                'department': 'Registry',
                'campus': main_campus,
                'is_default': False,
            },
            {
                'official_name': 'Prof. Mohamed Bangura',
                'title': 'Dean of Engineering',
                'department': 'Faculty of Engineering',
                'campus': main_campus,
                'is_default': False,
            },
            {
                'official_name': 'Dr. Aminata Kamara',
                'title': 'Campus Administrator',
                'department': 'Administration',
                'campus': freetown_campus,
                'is_default': True,
            },
        ]

        for sig_data in signatures_data:
            sig, created = Signature.objects.get_or_create(
                official_name=sig_data['official_name'],
                title=sig_data['title'],
                defaults={
                    'department': sig_data['department'],
                    'campus': sig_data['campus'],
                    'is_default': sig_data['is_default'],
                    'is_active': True,
                }
            )

            if created:
                # Save the placeholder image
                sig.signature_image.save(
                    f'signature_{sig.id}.png',
                    ContentFile(placeholder_image),
                    save=True
                )

        self.stdout.write(self.style.SUCCESS(f'Created {Signature.objects.count()} signatures'))

        # Summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*50))
        self.stdout.write(self.style.SUCCESS('SEEDING COMPLETE!'))
        self.stdout.write(self.style.SUCCESS('='*50))
        self.stdout.write(f'Campuses: {Campus.objects.count()}')
        self.stdout.write(f'Faculties: {Faculty.objects.count()}')
        self.stdout.write(f'Departments: {Department.objects.count()}')
        self.stdout.write(f'Courses: {Course.objects.count()}')
        self.stdout.write(f'SMS Templates: {SMSTemplate.objects.count()}')
        self.stdout.write(f'Signatures: {Signature.objects.count()}')
        self.stdout.write(self.style.SUCCESS('='*50 + '\n'))
