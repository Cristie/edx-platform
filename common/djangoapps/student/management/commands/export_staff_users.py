from __future__ import absolute_import, print_function

from datetime import datetime, timedelta
from django.core.management.base import BaseCommand

from djqscsv import write_csv
from openedx.core.djangoapps.content.course_overviews.models import CourseOverview
from student.models import CourseAccessRole


class Command(BaseCommand):

    help = """
    This command will export a csv of all users who have logged in within the last six months and
    have staff access role in active courses (Courses with end date in the future).
    """

    def handle(self, *args, **options):
        current_date = datetime.now()
        six_months_back_date = current_date - timedelta(days=180)
        active_courses = CourseOverview.objects.filter(end__gte=current_date).values_list('id', flat=True)
        course_access_roles = CourseAccessRole.objects.filter(
            role__in=['staff', 'instructor'],
            user__last_login__range=(current_date, six_months_back_date),
            course_id__in=active_courses,
            user__is_staff=False
        ).values('user__username', 'user__email', 'role')
        with open('staff_users.csv', 'wb') as csv_file:
            write_csv(course_access_roles, csv_file)

        print('Complete!')
