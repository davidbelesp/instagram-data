import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  username!: string;

  defaultOptions =  {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    scales: {
      x: {
        display: true
      },
      y: {
        display: true
      }
    }
  }

  followerChartData: any;
  followingChartData: any;
  followRatioChartData: any;
  followerChartOptions: any = this.defaultOptions;
  followingChartOptions: any = this.defaultOptions;
  followRatioChartOptions: any = this.defaultOptions;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) { 
    
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      if(!this.username) this.router.navigate(['/']);
    });

    this.setCharts();

    this.dataService.getProfileData(this.username).subscribe(data => {
      console.log(data);
    });
  }

  setCharts() {
    this.setFollowerChartData();
    this.setFollowingChartData();
    this.setRatioChartData();
  }

  setFollowerChartData() {
    this.dataService.getFollowersHistory(this.username).subscribe(res => {
      this.followerChartData = {
        labels: res.map(d => new Date(d.timestamp).toLocaleDateString()),
        datasets: [
          {
            label: 'Followers',
            data: res.map(d => d.followers_count),
            fill: false,
            borderColor: '#4bc0c0'
          }
        ]
      };
    });
    
  }

  setFollowingChartData() {
    this.dataService.getFollowingHistory(this.username).subscribe(res => {
      this.followingChartData = {
        labels: res.map(d => new Date(d.timestamp).toLocaleDateString()),
        datasets: [
          {
            label: 'Following',
            data: res.map(d => d.following_count),
            fill: false,
            borderColor: '#4bc0c0'
          }
        ]
      };
    });

  }

  setRatioChartData() {
    this.dataService.getFollowerRatioHistory(this.username).subscribe(res => {
      this.followRatioChartData = {
        labels: res.map(d => new Date(d.timestamp).toLocaleDateString()),
        datasets: [
          {
            label: 'Follower Ratio',
            data: res.map(d => d.follower_ratio),
            fill: false,
            borderColor: '#4bc0c0'
          }
        ]
      };
    });

  }

}




